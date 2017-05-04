# -*- mode: ruby -*-
# vi: set ft=ruby :

Vagrant.configure("2") do |config|
  config.vm.box = "ubuntu/trusty64"
  config.vm.network :forwarded_port, guest: 5000, host: 5000, auto_correct: true

  config.vm.provision :shell, :inline => <<-END
    sudo apt-get install -y python-pip
    sudo pip install -r /vagrant/src/requirements.txt
    sudo echo "export FLASK_APP=/vagrant/src/main.py" > .bashrc
  END
end
