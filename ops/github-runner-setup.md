# GitHub Self-Hosted Runner Setup

Use this if GitHub-hosted Actions are blocked by billing. The runner will live on your EC2 server and deploy locally after every push to `main`.

## 1. Open the runner page in GitHub

In your repository:

- go to `Settings`
- click `Actions`
- click `Runners`
- click `New self-hosted runner`
- choose `Linux`
- choose `x64`

Leave that page open. GitHub will show commands for your repo.

## 2. Connect to the EC2 server

SSH into the server:

```bash
ssh -i /path/to/ojay_lap.pem ec2-user@51.20.5.125
```

## 3. Install the runner on EC2

On the server, run:

```bash
mkdir -p ~/actions-runner && cd ~/actions-runner
```

Then copy the exact download command and configure command from GitHub's runner page and run them on the server.

They will look similar to:

```bash
curl -o actions-runner-linux-x64-<version>.tar.gz -L https://github.com/actions/runner/releases/download/v<version>/actions-runner-linux-x64-<version>.tar.gz
tar xzf ./actions-runner-linux-x64-<version>.tar.gz
./config.sh --url https://github.com/Ojay1963/LaptopAcessory --token YOUR_TEMP_TOKEN
```

During setup:

- runner group: press `Enter`
- runner name: press `Enter` or type `ec2-oj-devices`
- labels: press `Enter`
- work folder: press `Enter`

## 4. Install it as a service

Still on the server:

```bash
sudo ./svc.sh install ec2-user
sudo ./svc.sh start
```

Check status:

```bash
sudo ./svc.sh status
```

## 5. Add the app domain variable in GitHub

In the repository:

- go to `Settings`
- click `Secrets and variables`
- click `Actions`
- open the `Variables` tab
- create a repository variable named `APP_DOMAIN`

Use:

- `51.20.5.125` for now
- your real domain later when you have one

## 6. Push and test

After the runner is online:

- push to `main`
- open the `Actions` tab
- the `Deploy To AWS` workflow should run on the EC2 runner

## Notes

- You no longer need `EC2_HOST`, `EC2_USER`, or `EC2_SSH_KEY` secrets for this workflow
- The workflow deploys by syncing repo files into `/var/www/laptop-store`
- Live data is preserved in `/var/www/oj-devices-data/store.json`
