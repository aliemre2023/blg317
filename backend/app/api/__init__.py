import hashlib


def generate_hashPassword(password):
    # encode
    password_bytes = password.encode("utf-8")
    print("encoded: ", password_bytes)

    hashed_password = hashlib.sha256(password_bytes).hexdigest()
    return hashed_password
