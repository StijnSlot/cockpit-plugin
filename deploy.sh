#!/bin/bash

ssh-keygen -t rsa
ssh-copy-id

eval "$(ssh-agent -s)" # Start ssh-agent cache
chmod 600 .travis/id_rsa # Allow read access to the private key
ssh-add .travis/id_rsa # Add the private key to SSH

# Skip this command if you don't need to execute any additional commands after deploying.
ssh xander@allbirdsarecats.win.tue.nl -p 22 <<EOF
  cd Camunda/cockpit-plugin
  sh run.sh
EOF