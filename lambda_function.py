import boto3
import base64
import json
import io
import zipfile

# Initialize AWS clients
s3 = boto3.client("s3")
secrets = boto3.client("secretsmanager")

# ==== CONFIGURATION (Replace with your own values or environment variables) ====
BUCKET_NAME = "YOUR_S3_BUCKET_NAME"  # Replace with your S3 bucket name
SECRET_NAME = "YOUR_SECRET_NAME"     # Replace with your AWS Secrets Manager secret name

# CORS headers for API Gateway responses
CORS_HEADERS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Expose-Headers": "*"
}

# Cache for storing user credentials from Secrets Manager
_cached_users = None

# ==== Helper Functions ====

def get_users():
    """
    Fetch users from AWS Secrets Manager and cache them.
    Returns a dictionary in format: {username: {"password": "...", "root_folder": "..."}}
    """
    global _cached_users
    if _cached_users:
        return _cached_users

    resp = secrets.get_secret_value(SecretId=SECRET_NAME)
    _cached_users = json.loads(resp["SecretString"])
    return _cached_users


def authenticate(event):
    """
    Authenticate incoming request using Basic Auth.
    Returns (username, root_folder) if valid, otherwise (None, None).
    """
    headers = event.get("headers") or {}
    auth = headers.get("Authorization")
    if not auth or not auth.startswith("Basic "):
        return None, None

    try:
        raw = base64.b64decode(auth.split(" ", 1)[1]).decode()
        username, password = raw.split(":", 1)
    except Exception:
        return None, None

    users = get_users()
    if username in users and users[username]["password"] == password:
        return username, users[username]["root_folder"]

    return None, None


def response(status_code, body, is_base64=False, content_type=None):
    """
    Helper function to format API Gateway HTTP response.
    """
    headers = dict(CORS_HEADERS)
    if content_type:
        headers["Content-Type"] = content_type

    return {
        "statusCode": status_code,
        "headers": headers,
        "body": body if not is_base64 else base64.b64encode(body).decode(),
        "isBase64Encoded": is_base64
    }


def normalize_key(folder, filename):
    """
    Ensure the S3 key includes the folder prefix.
    """
    if filename.startswith(folder):
        return filename
    return f"{folder}{filename}"


# ==== Lambda Handler ====

def lambda_handler(event, context):
    try:
        method = event.get("httpMethod", "")
        path = event.get("path", "")
        params = event.get("queryStringParameters") or {}
        filename = params.get("filename")
        prefix = params.get("prefix")

        # Handle CORS preflight
        if method == "OPTIONS":
            return response(200, "")

        # Authenticate user
        user, folder = authenticate(event)
        if not user:
            return response(401, json.dumps({"error": "Unauthorized"}), content_type="application/json")

        # ==== UPLOAD FILE OR CREATE FOLDER ====
        if path.endswith("/put") and method == "PUT":
            if not filename:
                return response(400, json.dumps({"error": "Missing filename"}), content_type="application/json")

            file_content = base64.b64decode(event.get("body") or "")
            key = normalize_key(folder, filename)

            # If creating a folder (empty key ending with /), put a single space
            if filename.endswith("/") and file_content == b"":
                file_content = b" "

            s3.put_object(Bucket=BUCKET_NAME, Key=key, Body=file_content)
            msg = f'Folder "{filename}" created' if filename.endswith("/") else f'File "{filename}" uploaded'
            return response(200, msg)

        # ==== DOWNLOAD FILE ====
        elif path.endswith("/get") and method == "GET" and filename:
            key = normalize_key(folder, filename)
            try:
                obj = s3.get_object(Bucket=BUCKET_NAME, Key=key)
                return response(200, obj["Body"].read(), is_base64=True, content_type="application/octet-stream")
            except s3.exceptions.NoSuchKey:
                return response(404, json.dumps({"error": "File not found"}), content_type="application/json")

        # ==== LIST FOLDERS ====
        elif path.endswith("/list") and method == "GET":
            resp = s3.list_objects_v2(Bucket=BUCKET_NAME, Prefix=folder, Delimiter="/")
            folders = [p["Prefix"].replace(folder, "", 1) for p in resp.get("CommonPrefixes", [])]
            return response(200, json.dumps(folders), content_type="application/json")

        # ==== LIST FILES ====
        elif path.endswith("/list-files") and method == "GET":
            search_prefix = normalize_key(folder, prefix or "")
            resp = s3.list_objects_v2(Bucket=BUCKET_NAME, Prefix=search_prefix)
            files = []
            for obj in resp.get("Contents", []):
                key = obj["Key"].replace(folder, "", 1)
                if not prefix:
                    if "/" not in key:
                        files.append(key)
                else:
                    subpath = key[len(prefix):]
                    if subpath and "/" not in subpath:
                        files.append(subpath)
            return response(200, json.dumps(files), content_type="application/json")

        # ==== DOWNLOAD FOLDER AS ZIP ====
        elif path.endswith("/download-folder") and method == "GET" and prefix:
            resp = s3.list_objects_v2(Bucket=BUCKET_NAME, Prefix=normalize_key(folder, prefix))
            mem_file = io.BytesIO()
            with zipfile.ZipFile(mem_file, "w") as zf:
                for obj in resp.get("Contents", []):
                    file_data = s3.get_object(Bucket=BUCKET_NAME, Key=obj["Key"])["Body"].read()
                    zf.writestr(obj["Key"].replace(folder, "", 1), file_data)
            mem_file.seek(0)
            return response(200, mem_file.read(), is_base64=True, content_type="application/zip")

        # ==== DELETE FILE ====
        elif path.endswith("/delete") and method == "DELETE" and filename:
            key = normalize_key(folder, filename)
            try:
                s3.delete_object(Bucket=BUCKET_NAME, Key=key)
                return response(200, f'File "{filename}" deleted')
            except Exception as e:
                return response(500, json.dumps({"error": str(e)}), content_type="application/json")

        # ==== DELETE FOLDER ====
        elif path.endswith("/delete-folder") and method == "DELETE" and prefix:
            resp = s3.list_objects_v2(Bucket=BUCKET_NAME, Prefix=normalize_key(folder, prefix))
            if "Contents" in resp:
                try:
                    s3.delete_objects(
                        Bucket=BUCKET_NAME,
                        Delete={"Objects": [{"Key": obj["Key"]} for obj in resp["Contents"]]}
                    )
                except Exception as e:
                    return response(500, json.dumps({"error": str(e)}), content_type="application/json")
            return response(200, f'Folder "{prefix}" deleted')

        # Unsupported route
        else:
            return response(405, json.dumps({"error": "Unsupported operation"}), content_type="application/json")

    except Exception as e:
        # Catch-all for unexpected errors
        return response(500, json.dumps({"error": str(e)}), content_type="application/json")
