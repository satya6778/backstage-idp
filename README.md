# Backstage IDP on Kubernetes — Project README

Internal Developer Platform built with **Spotify Backstage**, running on
**Kubernetes (kubeadm)** on **AWS EC2**, with **Docker** for containerisation
and **Terraform** for infrastructure provisioning.

---

## Project Structure

```
backstage-idp/
├── app-config.yaml                  ← Main Backstage config (local dev)
├── app-config.production.yaml       ← Production overrides (K8s env vars)
├── catalog-info.yaml                ← Registers this app in the catalog
├── Dockerfile                       ← Multi-stage container build
├── package.json                     ← Yarn workspace root
├── .env.example                     ← Copy to .env and fill in secrets
│
├── packages/
│   ├── app/                         ← React frontend (port 3000 in dev)
│   │   └── src/
│   │       ├── App.tsx              ← Root component & page routes
│   │       └── components/          ← Custom UI components
│   └── backend/                     ← Node.js backend (port 7007)
│       └── src/
│           ├── index.ts             ← Server entry point
│           └── plugins/             ← Plugin registrations
│
├── plugins/
│   └── provision-s3-template.yaml   ← Backstage Software Template
│
├── k8s/
│   ├── deployment.yaml              ← Runs Backstage pod on Kubernetes
│   ├── service.yaml                 ← Exposes port 7007 via NodePort
│   ├── configmap.yaml               ← Mounts app-config into the pod
│   └── secret.yaml.example          ← Template only — never commit real secrets
│
├── terraform/
│   └── s3/
│       ├── main.tf                  ← S3 bucket resource definition
│       ├── variables.tf             ← Input variables (name, environment)
│       └── outputs.tf               ← Exported values after apply
│
└── .github/
    └── workflows/
        ├── build-push.yaml          ← Builds Docker image → pushes to ECR
        └── provision-s3.yaml        ← Triggered by Backstage → runs Terraform
```

---

## Quick Start (Local Development)

### 1. Clone the repo
```bash
git clone https://github.com/your-org/backstage-idp.git
cd backstage-idp
```

### 2. Set up your secrets
```bash
cp .env.example .env
# Edit .env and fill in your GITHUB_TOKEN and AWS credentials
```

### 3. Install dependencies
```bash
# Requires Node.js 18
yarn install
```

### 4. Run Backstage locally
```bash
yarn dev
# Frontend → http://localhost:3000
# Backend  → http://localhost:7007
```

---

## Deploying to Kubernetes on AWS EC2

### Step 1 — Build and push the Docker image
```bash
# Authenticate Docker with ECR
aws ecr get-login-password --region us-east-1 \
  | docker login --username AWS --password-stdin \
    <account-id>.dkr.ecr.us-east-1.amazonaws.com

# Build image
docker build -t backstage:latest .

# Tag and push
docker tag backstage:latest <account-id>.dkr.ecr.us-east-1.amazonaws.com/backstage:latest
docker push <account-id>.dkr.ecr.us-east-1.amazonaws.com/backstage:latest
```

### Step 2 — Create Kubernetes secret
```bash
kubectl create secret generic backstage-secrets \
  --from-literal=github-token=<YOUR_GITHUB_PAT> \
  --from-literal=aws-access-key-id=<YOUR_AWS_KEY> \
  --from-literal=aws-secret-access-key=<YOUR_AWS_SECRET>
```

### Step 3 — Update the image URL
Edit `k8s/deployment.yaml` and replace the placeholder image URL with your
real ECR URL.

### Step 4 — Apply Kubernetes manifests
```bash
kubectl apply -f k8s/configmap.yaml
kubectl apply -f k8s/deployment.yaml
kubectl apply -f k8s/service.yaml
```

### Step 5 — Access Backstage
```bash
kubectl get pods          # Check the pod is Running
kubectl get svc backstage # Get the NodePort (30007)
```
Open: `http://<YOUR-EC2-PUBLIC-IP>:30007`

---

## Terraform — Manual S3 Provisioning

```bash
cd terraform/s3
terraform init
terraform plan -var="bucket_name=my-team" -var="environment=dev"
terraform apply -var="bucket_name=my-team" -var="environment=dev"
```

Or trigger automatically via the Backstage "Provision S3 Bucket" template.

---

## GitHub Secrets Required

Add these in: GitHub repo → Settings → Secrets and variables → Actions

| Secret name             | What it is                              |
|-------------------------|-----------------------------------------|
| `AWS_ACCESS_KEY_ID`     | AWS IAM user access key                 |
| `AWS_SECRET_ACCESS_KEY` | AWS IAM user secret key                 |
| `GITHUB_TOKEN`          | Auto-provided by GitHub Actions         |

---

## Ticket Reference

**Ticket #47** — CI/CD Internal Developer Platform with Backstage on Kubernetes (kubeadm)
