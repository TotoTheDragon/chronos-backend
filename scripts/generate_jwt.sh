#!/bin/bash

# check if a passphrase between 4 and 511 characters was supplied
if [[ ${#1} -ge 511 ]] || [[ ${#1} -lt 4 ]] ; then
    echo "Please supply your passphrase between 4 and 511 characters"
    exit
fi

# script should be executed in (/scripts)
# move up one folder to (/)
cd ..

# create jwt folder to put pem files in
mkdir jwt

# generate private key
openssl genpkey -out jwt/private.pem -pass pass:$1 -aes256 -algorithm rsa -pkeyopt rsa_keygen_bits:4096

# generate public key
openssl pkey -in jwt/private.pem -passin pass:$1 -out jwt/public.pem -pubout
