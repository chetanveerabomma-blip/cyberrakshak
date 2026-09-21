import urllib.request
import json

req_body = json.dumps({
    "email": "admin@cyberrakshak.in",
    "password": "Password123!"
}).encode("utf-8")

req = urllib.request.Request(
    "http://localhost:8080/api/auth/login",
    data=req_body,
    headers={"Content-Type": "application/json"}
)

try:
    with urllib.request.urlopen(req) as resp:
        print("LOGIN RESPONSE:")
        print(resp.read().decode())
except Exception as e:
    print("Error:", e)
