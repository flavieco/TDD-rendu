from dotenv import load_dotenv
import os

load_dotenv()
import requests

BASE_URL = "https://api.taiga.io/api/v1"
USERNAME = os.getenv("TAIGA_USERNAME")
PASSWORD = os.getenv("TAIGA_PASSWORD")
PROJECT_SLUG = "flavieco-tdd"  # à adapter

# Connexion
response = requests.post(f"{BASE_URL}/auth", json={
    "type": "normal",
    "username": USERNAME,
    "password": PASSWORD
})
token = response.json()["auth_token"]
headers = {
    "Authorization": f"Bearer {token}",
    "Content-Type": "application/json"
}
print(f"Connecté en tant que : {USERNAME}")

# Infos du projet
response = requests.get(f"{BASE_URL}/projects/by_slug?slug={PROJECT_SLUG}", headers=headers)
project = response.json()
project_id = project["id"]
print(f"Projet : {project['name']}")

# Anomalies
response = requests.get(f"{BASE_URL}/issues?project={project_id}", headers=headers)
issues = response.json()
print(f"{len(issues)} anomalies trouvées")

# Créer une anomalie
new_issue = {
    "project": project_id,
    "subject": "Le calcul du prix total est incorrect",
    "description": "Le total ne tient pas compte des réductions."
}
response = requests.post(f"{BASE_URL}/issues", json=new_issue, headers=headers)
issue = response.json()
issue_id = issue["id"]
print(f"Anomalie créée : {issue['subject']}")

# Infos de l'anomalie
response = requests.get(f"{BASE_URL}/issues/{issue_id}", headers=headers)
detail = response.json()
print(f"Détails : #{detail['ref']} | {detail['subject']} | {detail['status_extra_info']['name']}")

# Modifier le statut
response = requests.get(f"{BASE_URL}/issue-statuses?project={project_id}", headers=headers)
statuses = response.json()
new_status_id = statuses[1]["id"]  # prend le 2ème statut disponible
requests.patch(f"{BASE_URL}/issues/{issue_id}", json={"status": new_status_id}, headers=headers)
print(f"Statut mis à jour : {statuses[1]['name']}")

# Import depuis CSV
with open("anomalies.csv", newline='', encoding='utf-8') as f:
    reader = csv.DictReader(f)
    for row in reader:
        payload = {
            "project": project_id,
            "subject": row["subject"],
            "description": row["description"]
        }
        r = requests.post(f"{BASE_URL}/issues", json=payload, headers=headers)
        print(f"Issue importée : {r.json()['subject']}")