/**
 * Única fuente de datos del sitio. Todo el contenido visible vive aquí:
 * las páginas y componentes solo leen de este archivo.
 *
 * Contenido actualizado el 2026-11-14 desde ~/Documents/cv/JuanCamiloMelo-CV-EN
 * (fechas de proyectos contrastadas contra el historial de cada repo; mismos
 * proyectos y orden que el CV).
 *
 * Regla de estilo del copy: inglés, sin em dashes (usar punto, coma o dos
 * puntos en su lugar).
 */

export interface Project {
  slug: string;
  title: string;
  /** Título corto para el índice del home y la navegación entre proyectos. */
  shortTitle: string;
  /** Una línea para el índice del home. */
  summary: string;
  /** Párrafos para la página de detalle. */
  description: string[];
  highlights: string[];
  stack: string[];
  /** Personal, curso o equipo: de dónde sale el proyecto. */
  context: string;
  /** Fecha corta: "Mon YYYY" o rango "Mon to Mon YYYY". */
  date: string;
  repo?: string;
  /** Etiqueta del enlace al repo cuando no es un repo único (p. ej. una org). */
  repoLabel?: string;
  /** Sitio publicado del proyecto, si existe. */
  live?: string;
  liveLabel?: string;
}

export interface NowItem {
  label: string;
  title: string;
  period: string;
  text: string;
  stack: string[];
  href?: string;
}

export interface Role {
  title: string;
  org: string;
  period: string;
  points: string[];
}

export interface SkillGroup {
  label: string;
  items: string[];
}

export interface Certification {
  name: string;
  issuer: string;
  date: string;
}

export const site = {
  name: 'Juan Camilo Melo',
  /** Wordmark del hero (tinta WebGL) y del logo. */
  wordmark: 'melo',
  role: 'Cloud & DevOps Engineer',
  lede: 'I design and automate infrastructure end to end: CI/CD pipelines, GitOps, infrastructure as code, Kubernetes and observability on AWS and Azure.',
  bio: 'Cloud and DevOps engineer with over a year of hands-on project experience: Terraform on AWS through OIDC pipelines, GitOps with Argo CD on Amazon EKS, security-gated CI/CD, Kubernetes operations and observability, plus cloud architecture on Azure and a strong networking foundation. Telematics Engineering student at Universidad Icesi.',
  /**
   * Correo en base64: nunca viaja en texto plano en el HTML (anti-scraping).
   * Lo ensambla EmailReveal al interactuar.
   */
  emailB64: 'amNtbDI5MzEwQGdtYWlsLmNvbQ==',
  github: 'https://github.com/Melo088',
  githubHandle: 'Melo088',
  linkedin: 'https://www.linkedin.com/in/juan-camilo-melo',
  /** El nombre del archivo es el que ve quien lo descarga. */
  cvPath: '/juancmelo-cv.pdf',
  cvFileName: 'juancmelo-cv.pdf',
  location: 'Cali, Colombia',
  timeZone: 'America/Bogota',
  /** Retrato para /about, ya tratado a mano (tono y textura): se muestra tal cual. */
  portrait: '/images/portrait.jpg',
  /**
   * Fondo del hero, impreso en trama halftone: Nymphalis antiopa, lámina de
   * "Birds Illustrated" (Nature Study Publishing Co., Chicago, c. 1900),
   * dominio público vía Wikimedia Commons (File:Nymphalis_antiopa-black.jpg).
   */
  heroBackdrop: '/images/hero-butterfly.webp',
  education: {
    school: 'Universidad Icesi',
    city: 'Cali, Colombia',
    degree: 'B.Eng. in Telematics Engineering',
    /** Solo la graduación esperada: sin fecha de inicio ni semestre en curso. */
    period: 'Expected Feb 2028',
    graduation: '2028',
    gpa: '4.7/5.0',
    honors: [
      'Honor Scholarship (Beca de Honor): 2023-2, 2024-2 and 2025-2',
      'Honor Roll every semester to date',
    ],
    coursework:
      'Infrastructure I to III, Platforms I and II, Infrastructure Automation, Cloud Computing, Operating Systems, Software Engineering, IT Operations',
  },
  languages: 'Spanish (native), English (B2)',
} as const;

/** Cifras cortas para la franja bajo la presentación. */
export const facts = [
  { value: '4.7', label: 'GPA out of 5.0' },
  { value: '3×', label: 'Honor Scholarship' },
  { value: '6', label: 'Certifications' },
];

/** Lo que está en marcha ahora (2026-2). */
export const nowUpdated = 'Nov 2026';
export const now: NowItem[] = [
  {
    label: 'Degree project',
    title: 'IAsLab ORCHID',
    period: 'Aug 2026 to May 2027',
    text: 'An orchestration and governance platform for AI and ML workloads on the university GPU infrastructure: model serving, reservation-based quotas with role priority, and GPU telemetry. Team of three.',
    stack: ['Kubernetes', 'KubeRay', 'NVIDIA GPU Operator', 'vLLM', 'Ollama', 'DCGM', 'Prometheus', 'Loki', 'Grafana'],
  },
  {
    label: 'Team project',
    title: 'AromaPacífico',
    period: 'Since Nov 2026',
    text: 'Coffee traceability from farm to port on AWS IoT: versioned Terraform modules, OIDC pipelines that plan, deploy and check drift, and a deploy freeze during harvest. Team of five.',
    stack: ['Terraform', 'AWS IoT Core', 'Lambda', 'DynamoDB', 'GitHub Actions', 'Checkov'],
    href: 'https://github.com/aromapacifico-devops',
  },
  {
    label: 'Integrative project',
    title: 'Vision Care',
    period: 'Sep to Nov 2026',
    text: 'Clinical management and treatment adherence platform for an independent ophthalmology practice: a patient mobile app, AI drafted clinical notes the doctor validates, supply inventory and scheduling. Scrum over five sprints.',
    stack: ['Spring Boot', 'React Native', 'TypeScript', 'PostgreSQL', 'Scrum'],
  },
  {
    label: 'Work',
    title: 'Networking Lab Assistant',
    period: 'Since Feb 2026',
    text: 'Operating the networking lab at Universidad Icesi: configuring layer 2 and layer 3 switches and routers, troubleshooting connectivity and supporting the classes held in the lab.',
    stack: ['MikroTik', 'Cisco', 'VLANs', 'Troubleshooting'],
  },
];

export const experience: Role[] = [
  {
    title: 'Networking Laboratory Assistant',
    org: 'Universidad Icesi',
    period: 'Since Feb 2026',
    points: [
      'Operate the lab’s internal network: configure layer 2 and layer 3 switches and routers, and troubleshoot connectivity for the classes held in the lab.',
      'Support faculty and students during lab sessions with device setup and hardware maintenance. Selected through a merit-based application.',
    ],
  },
  {
    title: 'Undergraduate Researcher, Satellite Networks',
    org: 'Universidad Icesi research seedbed',
    period: 'Jul to Nov 2025',
    points: [
      'Presented a state-of-the-art review of Non-Terrestrial Networks and LEO constellations (Starlink, OneWeb, Telesat Lightspeed, Kuiper) to representatives of the company Celsia.',
    ],
  },
  {
    title: 'Teaching Assistant, Algorithms & Programming',
    org: 'Universidad Icesi',
    period: 'Feb to Nov 2024',
    points: [
      'Supported 30+ students per semester in Java: object-oriented design, data structures and Git workflows.',
      'Appointed by faculty for academic standing and proficiency in data structures and OOP.',
    ],
  },
];

export const skillGroups: SkillGroup[] = [
  {
    label: 'Cloud',
    items: [
      'AWS: EKS, EC2/ASG, VPC, IAM/IRSA, Lambda, API Gateway, IoT Core, DynamoDB, RDS, S3, CloudFront, CloudWatch',
      'Azure architecture: hub and spoke, Azure Firewall, IoT Hub, Fabric',
      'GCP',
    ],
  },
  {
    label: 'IaC & CI/CD',
    items: ['Terraform', 'CloudFormation', 'Ansible', 'GitHub Actions (OIDC)', 'Jenkins (JCasC)', 'Argo CD', 'Helm', 'Kustomize'],
  },
  {
    label: 'Kubernetes',
    items: ['Docker (Compose)', 'Kubernetes: EKS, kubeadm, k3d', 'KEDA', 'NetworkPolicies'],
  },
  {
    label: 'Security',
    items: ['SonarQube', 'Trivy', 'Gitleaks', 'Checkov', 'Syft (SBOM)', 'External Secrets', 'Keycloak (MFA)'],
  },
  {
    label: 'Observability',
    items: ['Prometheus', 'Grafana', 'Alertmanager', 'ELK', 'Fluent Bit', 'Jaeger', 'Kubecost', 'CloudWatch'],
  },
  {
    label: 'Networking',
    items: ['MikroTik', 'Cisco', 'VLANs', 'IPv4/IPv6 dual stack', 'nftables', 'BIND9', 'Kea DHCP', 'Ubuntu Server', 'KVM'],
  },
  {
    label: 'Software',
    items: ['Python', 'Bash', 'Go', 'Java (Spring Boot)', 'JavaScript/TypeScript', 'SQL'],
  },
];

/** De la más reciente a la más antigua (fechas de Credly). */
export const certifications: Certification[] = [
  { name: 'AWS Academy Graduate: Cloud Operations', issuer: 'Amazon Web Services', date: 'Jul 2026' },
  { name: 'AWS Academy Graduate: Cloud Foundations', issuer: 'Amazon Web Services', date: 'May 2026' },
  { name: 'Google Cloud Computing Foundations', issuer: 'Google Cloud', date: 'Apr 2026' },
  { name: 'Google Cloud Skill Badges (4)', issuer: 'Google Cloud', date: 'Mar to Apr 2026' },
  { name: 'Cisco DevNet Associate', issuer: 'Cisco', date: 'Nov 2025' },
  { name: 'Google Cybersecurity Certificate', issuer: 'Google', date: '2024 to 2025' },
];

/** Cinta de skills del home (nombres cortos). */
export const tickerSkills = [
  'Kubernetes',
  'Terraform',
  'Argo CD',
  'AWS',
  'Azure',
  'GitHub Actions',
  'Ansible',
  'Keycloak',
  'Prometheus',
  'Jenkins',
];

/** Mismos proyectos y orden que el CV (más reciente primero). */
export const projects: Project[] = [
  {
    slug: 'aromapacifico',
    title: 'AromaPacífico: AWS IoT Traceability Platform as Code',
    shortTitle: 'AromaPacífico',
    summary:
      'Coffee traceability from farm to port on AWS IoT: five versioned Terraform modules consumed by tag, OIDC pipelines that plan, deploy, destroy and check drift, and a deploy freeze during harvest.',
    description: [
      'AromaPacífico follows every 60 kg sack of coffee from farms in Cauca, Huila and Tolima to the port of Buenaventura, monitors crops and drying, and supports a drone service for pest confirmation. A team of five designed the platform; I wrote the infrastructure repository and the checks every repository shares.',
      'Reusable code lives in five module repositories: network, security, IoT telemetry ingestion, farm identity and an event-driven inference function, each with its own version and CI. The infrastructure repository only decides which version runs where: one root per environment (dev, test and prod) with encrypted, locked S3 state, and a bootstrap for the state buckets, keys, OIDC provider and pipeline roles.',
      'Pipelines run on GitHub Actions with separate plan and apply roles per environment: a plan on every pull request, a deploy that applies the exact saved plan, a destroy, and a scheduled drift check. Test was applied from main with 127 resources, a smoke test traced a simulated reading from IoT Core to DynamoDB in about ten seconds, a second plan showed zero changes, and the environment was destroyed through the same pipeline.',
    ],
    highlights: [
      'Five versioned Terraform modules consumed by exact tag from dev, test and prod roots',
      'OIDC-only cloud access with separate plan and apply roles per environment',
      'Saved-plan deploys: 127 resources applied in test, then a clean zero-change plan',
      'Shared checks: TFLint, Checkov, Gitleaks, actionlint and zizmor at checksum-verified versions, SHA-pinned actions',
      'A tested harvest-season freeze gate that blocks deploys when the business cannot afford them',
    ],
    stack: ['Terraform', 'AWS IoT Core', 'Lambda', 'SQS', 'DynamoDB', 'S3', 'KMS', 'GitHub Actions', 'OIDC', 'TFLint', 'Checkov', 'Gitleaks', 'Python'],
    context: 'Team project · team of five',
    date: 'Since Nov 2026',
    repo: 'https://github.com/aromapacifico-devops',
    repoLabel: 'GitHub organization',
  },
  {
    slug: 'plazofiscal',
    title: 'PlazoFiscal: Kubernetes Platform for a Tax-Deadline SaaS',
    shortTitle: 'PlazoFiscal',
    summary:
      'A five-service app on a three-node k3d cluster with one-command setup: zero-downtime rolling updates, default-deny network policies, KEDA autoscaling by load and filing dates, full observability and MFA in front of every tool.',
    description: [
      'PlazoFiscal is an invented company for an academic exercise: a service that helps accounting firms in Colombia track their clients’ tax deadlines. The platform runs on a local three-node k3d cluster; make up builds and deploys everything and make down removes it.',
      'The application ships with rolling updates that add one pod at a time and remove none until its replacement is ready. Network policies deny by default and declare every allowed path, Redis keeps data on a persistent volume, and KEDA scales on CPU load and on rules tied to the filing calendar of the business.',
      'Operations come with it: Prometheus and Grafana dashboards for the machine, the cluster, the network and autoscaling, with alerts posted to Slack; Fluent Bit, Logstash, Elasticsearch and Kibana for logs and events; Jaeger following one request across the services; and Kubecost by namespace. Keycloak with a required authenticator code sits in front of every tool and the app through oauth2-proxy.',
    ],
    highlights: [
      'One command to build and deploy the whole platform, one to remove it',
      'Rolling updates with zero unavailable pods and default-deny NetworkPolicies',
      'KEDA autoscaling by CPU and by tax-filing dates',
      'Metrics, logs, traces and costs: Prometheus, Grafana, ELK with Fluent Bit, Jaeger and Kubecost',
      'Keycloak MFA through oauth2-proxy in front of every tool and the application',
    ],
    stack: ['Kubernetes', 'k3d', 'KEDA', 'Traefik', 'Keycloak', 'oauth2-proxy', 'Redis', 'Prometheus', 'Grafana', 'Fluent Bit', 'Elasticsearch', 'Kibana', 'Jaeger', 'Kubecost'],
    context: 'Academic project',
    date: 'Nov 2026',
    repo: 'https://github.com/plazofiscal-devops/plazofiscal-platform',
  },
  {
    slug: 'kitsalud',
    title: 'KitSalud: an Offline Primary-Care Health Kit',
    shortTitle: 'KitSalud',
    summary:
      'A field kit for health brigades that works without Internet: a KVM mini PC, a MikroTik switch and a Wi-Fi AP, automated with 33 Ansible roles, with a segmented dual-stack network, central identity, health apps and observability.',
    description: [
      'A health brigade deploys the kit on site to deliver clinical, administrative and community services with no Internet at all. It is one mini PC running Ubuntu with KVM, a MikroTik CCR2004 used as a layer 2 switch and a Wi-Fi access point, hosting two virtual machines: one clinical, one for the community.',
      'Everything is configured by 33 Ansible roles with secrets in ansible-vault: two VLANs plus a server network, an nftables default-deny firewall for IPv4 and IPv6, Kea DHCPv4 and stateless DHCPv6, radvd, BIND9 for the internal zone, Chrony, an internal CA and a captive portal. Samba AD is the single identity for SMB shares, Grafana and the Flask apps over LDAPS.',
      'The apps run with Docker Compose behind Caddy: DHIS2 for patients, Kiwix for an offline health library, Jellyfin for audio and video, and a pre-registration form that can only insert into the clinical database. Restic pulls encrypted weekly backups to a USB disk, Prometheus, Grafana and rsyslog keep it observable, and 13 scripted acceptance tests prove each requirement.',
    ],
    highlights: [
      '33 Ansible roles, secrets in ansible-vault, rebuilt from scratch on a virtual lab before touching the kit',
      'Dual-stack nftables firewall that denies by default, with a captive portal for the community network',
      'Samba AD as the single identity for files, dashboards and apps',
      'Encrypted pull-model backups with restic and a documented restore',
      '13 scripted acceptance tests, each saving its own evidence',
    ],
    stack: ['Ansible', 'KVM', 'Ubuntu Server', 'MikroTik', 'nftables', 'Kea DHCP', 'BIND9', 'Samba AD', 'Docker Compose', 'Caddy', 'DHIS2', 'Kiwix', 'Jellyfin', 'restic', 'Prometheus', 'Grafana'],
    context: 'Course project · Platforms I',
    date: 'Since Sep 2026',
    repo: 'https://github.com/kitsalud-movil-plats1',
    repoLabel: 'GitHub organization',
  },
  {
    slug: 'frioandes',
    title: 'FríoAndes: Azure Architecture for a Cold-Chain Logistics Company',
    shortTitle: 'FríoAndes',
    summary:
      'Moving a cold-chain operator from a Cali datacenter to Azure: hybrid network, cloud firewall, real-time temperature telemetry, observability with SLOs and a Microsoft Fabric data platform. Design, costs and a project website.',
    description: [
      'FríoAndes runs a food cold chain from a VMware datacenter in Cali, with eight regional centers, 120 trucks and a control tower. A team of four designed its replacement on Azure as a case study, with costs, a migration plan and a design system. I designed the network, security, telemetry, observability and data platform chapters, and built the project website.',
      'The network is hub and spoke in East US 2 with VPN Gateway, Azure Firewall, DNS Private Resolver and Bastion, with Cali connected through two providers. The IP plan and subnetting are checked by verification scripts, and the firewall policy table, with WAF rate-limit rules for the public portal, is versioned and verified the same way.',
      'Temperature telemetry enters through IoT Hub and Stream Analytics raises an excursion alert within a minute. Observability on Azure Monitor and Log Analytics tracks two service level objectives and takes over from Zabbix by day 61. Microsoft Fabric reads the database incrementally and the 1.2 PB archive through shortcuts, without a second copy.',
    ],
    highlights: [
      'Hybrid hub-and-spoke network with a script-verified IP plan',
      'Azure Firewall policy table with WAF rate limits for the public portal',
      'Excursion alerts within one minute from IoT Hub and Stream Analytics',
      'Two SLOs on Azure Monitor and a planned transition from Zabbix',
      'Microsoft Fabric over the 1.2 PB archive without duplicating it',
    ],
    stack: ['Azure', 'Azure Firewall', 'VPN Gateway', 'IoT Hub', 'Stream Analytics', 'Azure Monitor', 'Log Analytics', 'Microsoft Fabric', 'Entra ID', 'draw.io', 'Vite', 'GSAP'],
    context: 'Team project · team of four',
    date: 'Sep to Oct 2026',
    repo: 'https://github.com/frioandes-platform',
    repoLabel: 'GitHub organization',
    live: 'https://melo088.github.io/frioandes-web/',
    liveLabel: 'Project website',
  },
  {
    slug: 'docket-platform',
    title: 'Docket: GitOps Delivery Platform on AWS EKS',
    shortTitle: 'Docket Platform',
    summary:
      'Five polyglot microservices delivered through ten connected pipelines, versioned Terraform modules and Argo CD onto a multi-AZ EKS cluster, with gated promotion from dev to production.',
    description: [
      'Docket is a task management platform for a law firm client brief, built as a team in the Infrastructure Automation course across thirteen repositories. Five services, one per repository: authentication in Go, users in Spring Boot, tasks in Node.js publishing events to Redis, a Python worker consuming the queue, and a Vue frontend.',
      'Infrastructure is Terraform: reusable modules published with tagged releases and consumed by pinned tag from environment stacks that build a multi-AZ VPC, EKS, the registry and the state backend. The infrastructure is ephemeral by design, destroyed and applied routinely to stay inside a 100 USD credit budget.',
      'Each service pipeline builds, tests, scans and publishes, then opens a promotion pull request that bumps an image tag for Argo CD to apply. Staging requires an integration suite run against dev; production requires a recorded approval and a manual sync. Rollback is a reverted pull request through the same path. Every decision is recorded in 25 ADRs.',
    ],
    highlights: [
      'Ten connected pipelines from commit to production across dev, staging and prod',
      'SonarQube quality gate and a HIGH/CRITICAL image gate on every service',
      'Three test levels gating promotion, including Playwright end to end',
      'Secrets from SSM through External Secrets and IRSA; CI reaches AWS with OIDC, no long-lived keys',
      'CloudWatch Container Insights with alarms posted to Slack through SNS and Lambda',
    ],
    stack: ['Terraform', 'AWS EKS', 'Argo CD', 'Kustomize', 'GitHub Actions', 'SonarQube', 'Trivy', 'Playwright', 'External Secrets', 'Go', 'Spring Boot', 'Node.js', 'Python', 'Vue', 'Redis', 'CloudWatch'],
    context: 'Team project · Infrastructure Automation',
    date: 'Aug to Sep 2026',
    repo: 'https://github.com/sintratel-docket-platform/docket-architecture',
    repoLabel: 'Architecture repo',
  },
  {
    slug: 'platform-pipeline',
    title: 'Platform Pipeline: Self-Hosted CI/CD, GitOps and Observability',
    shortTitle: 'Platform Pipeline',
    summary:
      'A complete DevOps platform that runs on a laptop: Jenkins as code with quality and security gates, Terraform-managed kind, Argo CD GitOps with automatic rollback, and full observability. Zero cloud credentials.',
    description: [
      'A locally runnable DevOps platform built around a two-service Go application. Jenkins is configured entirely as code (plugins.txt, JCasC and Job DSL) and runs build, unit tests, a SonarQube quality gate, Gitleaks secret scanning, the image build, a Syft SBOM and a Trivy vulnerability gate before pushing to a local registry.',
      'Terraform with local state provisions the whole environment: the Docker network, the registry, a kind cluster, namespaces, and the Argo CD and kube-prometheus-stack Helm releases. No cloud account is needed at any point.',
      'Delivery is GitOps. Argo CD reconciles a Kustomize deploy folder from a local Gitea; Jenkins releases by committing an image tag bump, and a post-deploy health gate reverts the release commit automatically if the new version never becomes healthy.',
    ],
    highlights: [
      'Jenkins fully as code: plugins, JCasC and Job DSL',
      'Quality and security gates: SonarQube, Gitleaks, Syft SBOM, Trivy',
      'Argo CD GitOps with an automatic rollback on failed health checks',
      'kube-prometheus-stack with a provisioned dashboard, ServiceMonitors and PrometheusRule alerts',
      'Validated with scripted traffic, pod failure and failed release demos',
    ],
    stack: ['Go', 'Jenkins', 'Terraform', 'kind', 'Argo CD', 'Helm', 'Kustomize', 'SonarQube', 'Gitleaks', 'Trivy', 'Syft', 'Prometheus', 'Grafana', 'Gitea'],
    context: 'Personal project',
    date: 'Jul 2026',
    repo: 'https://github.com/Melo088/platform-pipeline',
  },
  {
    slug: 'ecommerce-aws-iac',
    title: 'E-Commerce Platform: Full Stack + AWS Infrastructure as Code',
    shortTitle: 'E-Commerce on AWS',
    summary:
      'Full-stack e-commerce with JWT auth and MercadoPago payments, provisioned through 10 CloudFormation stacks with an auto-scaling fleet, CDN and operational alarms.',
    description: [
      'A Java 21 and Spring Boot REST API with JWT and BCrypt authentication and role-based access control, a React 18 and Tailwind SPA served from S3 through CloudFront, and PostgreSQL on RDS. All of it provisioned through 10 CloudFormation stacks; nothing was created by hand in the console.',
      'An EC2 auto-scaling group (min 1, max 3) runs behind an ALB with a CPU target-tracking policy. Separate CloudFront distributions serve the frontend, the backend proxy and media assets with S3 origin access control. MercadoPago Checkout Bricks handles payments through HTTPS webhooks, and CloudWatch alarms, SNS notifications and CloudTrail cover operations.',
    ],
    highlights: [
      '10 CloudFormation stacks, fully reproducible infrastructure',
      'Auto-scaling EC2 fleet behind an ALB with CPU target tracking',
      'Three CloudFront distributions with S3 origin access control',
      'MercadoPago payments with HTTPS webhook callbacks',
      'Bash automation for the whole deployment lifecycle',
    ],
    stack: ['Java 21', 'Spring Boot', 'Spring Security', 'React 18', 'PostgreSQL', 'CloudFormation', 'EC2 ASG', 'RDS', 'ALB', 'CloudFront', 'S3', 'CloudWatch', 'MercadoPago'],
    context: 'Course project · Infrastructure III',
    date: 'Apr to May 2026',
    repo: 'https://github.com/Melo088/ecommerce-iac-aws',
  },
];

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}
