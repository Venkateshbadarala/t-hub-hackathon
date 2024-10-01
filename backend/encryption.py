from cryptography.fernet import Fernet

key = Fernet.generate_key()
cipher = Fernet(key)

def encrypt_entry(entry):
    return cipher.encrypt(entry.encode())

def decrypt_entry(encrypted_entry):
    return cipher.decrypt(encrypted_entry).decode()
