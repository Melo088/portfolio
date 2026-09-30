/**
 * Única fuente de datos del sitio. Todo el contenido visible vive aquí:
 * las páginas y componentes solo leen de este archivo.
 *
 * Contenido actualizado el 2026-09-27 desde el CV 2026F
 * (~/Documents/cv/JuanCamiloMelo-CV-2026F) y los repos/organizaciones de
 * GitHub del semestre 2026-2.
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
  /** Fecha corta, formato "Mon YYYY". */
  date: string;
  repo?: string;
  /** Etiqueta del enlace al repo cuando no es un repo único (p. ej. una org). */
  repoLabel?: string;
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
  role: 'Cloud & DevOps Engineering',
  lede: 'I design and automate infrastructure end to end: CI/CD pipelines, GitOps, infrastructure as code, containers and observability on AWS and GCP.',
  bio: 'Telematics Engineering student at Universidad Icesi pursuing Cloud and DevOps engineering. Over a year of hands-on, project-based work designing and automating infrastructure: CI/CD pipelines, GitOps workflows, infrastructure as code, container orchestration and observability across AWS and GCP, on top of a foundation in networking, systems, software and security.',
  email: 'jcml29310@gmail.com',
  github: 'https://github.com/Melo088',
  githubHandle: 'Melo088',
  linkedin: 'https://linkedin.com/in/juan-camilo-melo',
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
    period: 'Feb 2023 to Feb 2028',
    graduation: '2028',
    gpa: '4.7/5.0',
    semester: '8th of 10',
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
  { value: '8/10', label: 'Semesters' },
];

/** Lo que está en marcha ahora (2026-2). */
export const nowUpdated = 'Sep 2026';
export const now: NowItem[] = [
  {
    label: 'Degree project',
    title: 'IAsLab ORCHID',
    period: 'Aug 2026 to May 2027',
    text: 'An orchestration and governance platform for AI and ML workloads on the university GPU infrastructure: model serving, reservation-based quotas with role priority, and GPU telemetry. Team of three.',
    stack: ['Kubernetes', 'KubeRay', 'NVIDIA GPU Operator', 'vLLM', 'Ollama', 'DCGM', 'Prometheus', 'Loki', 'Grafana'],
  },
  {
    label: 'Integrative project',
    title: 'Vision Care',
    period: 'Sep to Nov 2026',
    text: 'Clinical management and treatment adherence platform for an independent ophthalmology practice: a patient mobile app, AI drafted clinical notes the doctor validates, supply inventory and scheduling. Scrum over five sprints.',
    stack: ['Spring Boot', 'TypeScript', 'Python agents', 'Mobile', 'Scrum'],
  },
  {
    label: 'Platforms I',
    title: 'KitSalud Móvil',
    period: 'Aug to Nov 2026',
    text: 'A portable primary-care health kit that keeps working without Internet: segmented network with a captive portal, a small virtualized platform, health apps and an offline library, all observed.',
    stack: ['OPNsense', 'KVM', 'BIND9', 'Samba AD', 'DHIS2', 'Kiwix', 'Prometheus', 'Grafana', 'Loki'],
    href: 'https://github.com/kitsalud-movil-plats1',
  },
  {
    label: 'Work',
    title: 'Networking Lab Assistant',
    period: 'Since Feb 2026',
    text: 'Maintaining and monitoring the network lab at Universidad Icesi, and supporting sessions with device configuration, connectivity troubleshooting and hardware care.',
    stack: ['MikroTik', 'Cisco IOS', 'VLANs', 'Troubleshooting'],
  },
];

export const experience: Role[] = [
  {
    title: 'Networking Laboratory Assistant',
    org: 'Universidad Icesi',
    period: 'Since Feb 2026',
    points: [
      'Maintain and monitor the internal network of the university lab, keeping specialized equipment healthy and available.',
      'Hands-on support during lab sessions: device configuration, connectivity troubleshooting and hardware maintenance.',
    ],
  },
  {
    title: 'Satellite Networks Researcher',
    org: 'Celsia research group',
    period: '2024 to 2025',
    points: [
      'Research on the evolution and economics of modern satellite networks, focused on LEO constellations such as Starlink.',
    ],
  },
  {
    title: 'Teaching Assistant, Algorithms & Programming',
    org: 'Universidad Icesi',
    period: 'Feb 2024 to Nov 2024',
    points: [
      'Supported 30+ students per semester designing algorithmic solutions in Java: object-oriented design, data structures and Git workflows.',
      'Appointed by faculty for academic standing and proficiency in data structures and OOP.',
    ],
  },
];

export const skillGroups: SkillGroup[] = [
  {
    label: 'Cloud',
    items: ['AWS: EC2, ASG, EKS, RDS, S3, CloudFront, Lambda, API Gateway, Cognito, DynamoDB', 'GCP: Compute Engine, VPC, Load Balancing, Cloud Run'],
  },
  {
    label: 'DevOps & GitOps',
    items: ['Terraform', 'CloudFormation', 'Ansible', 'Docker', 'Kubernetes', 'Helm', 'Kustomize', 'Argo CD', 'GitHub Actions', 'Jenkins', 'SonarQube', 'Trivy', 'Bash'],
  },
  {
    label: 'Observability',
    items: ['Prometheus', 'Grafana', 'Alertmanager', 'Loki', 'CloudWatch', 'LibreNMS', 'SNMP'],
  },
  {
    label: 'Networking',
    items: ['MikroTik RouterOS', 'Cisco IOS', 'VLANs', 'IPv4/IPv6 dual stack', 'BIND9', 'Kea DHCP', 'GPON'],
  },
  {
    label: 'Software',
    items: ['Java', 'Spring Boot', 'Go', 'Python', 'PostgreSQL', 'React', 'TypeScript', 'Flutter'],
  },
];

export const certifications: Certification[] = [
  { name: 'AWS Academy Cloud Operations', issuer: 'Amazon Web Services', date: 'Jul 2026' },
  { name: 'AWS Academy Cloud Foundations', issuer: 'Amazon Web Services', date: 'May 2026' },
  { name: 'Google Cloud Computing Foundations', issuer: 'Google Cloud', date: 'Apr 2026' },
  { name: 'Google Cloud Skill Badges (4)', issuer: 'Google Cloud', date: '2026' },
  { name: 'Cisco DevNet Associate', issuer: 'Cisco', date: 'Nov 2025' },
  { name: 'Google Cybersecurity Certificate', issuer: 'Google', date: '2024 to 2025' },
];

/** Cinta de skills del home (nombres cortos). */
export const tickerSkills = [
  'Kubernetes',
  'Terraform',
  'Argo CD',
  'AWS',
  'Ansible',
  'Jenkins',
  'Prometheus',
  'GitHub Actions',
  'Docker',
  'GCP',
];

export const projects: Project[] = [
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
    date: 'Sep 2026',
    repo: 'https://github.com/sintratel-docket-platform/docket-architecture',
    repoLabel: 'Architecture repo',
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
    date: 'May 2026',
    repo: 'https://github.com/Melo088/ecommerce-iac-aws',
  },
  {
    slug: 'icesiscore-serverless',
    title: 'IcesiScore: Serverless Real-Time Sports Platform',
    shortTitle: 'IcesiScore',
    summary:
      'Serverless AWS backend broadcasting live scores over WebSockets through an event-driven pipeline, plus a Flutter app with Clean Architecture and BLoC.',
    description: [
      'A real-time platform for university sports. The backend is serverless: Python Lambda functions behind API Gateway REST and WebSocket endpoints, Cognito JWT authentication, RDS PostgreSQL for relational data and DynamoDB as the WebSocket connection registry.',
      'Live scores follow an event-driven path: an event is posted, a Lambda publishes to SNS, a broadcaster Lambda scans the registry and pushes to every connection, cleaning up stale ones on GoneException. The Flutter app uses Clean Architecture with GetIt and BLoC, and Terraform provisions all of the AWS side.',
    ],
    highlights: [
      'Event-driven broadcast: Lambda, SNS, DynamoDB and WebSocket postToConnection',
      'Stale connection cleanup on GoneException',
      'Cognito JWT authentication',
      'Flutter with Clean Architecture, GetIt and BLoC',
      'All AWS infrastructure in Terraform',
    ],
    stack: ['Python', 'AWS Lambda', 'API Gateway WebSocket', 'Cognito', 'RDS', 'DynamoDB', 'SNS', 'Terraform', 'Flutter'],
    context: 'Course project · Mobile Applications',
    date: 'Apr 2026',
    repo: 'https://github.com/Melo088/icesi_score',
  },
  {
    slug: 'kubernetes-ansible',
    title: 'Kubernetes Cluster: Automated Provisioning with Ansible',
    shortTitle: 'Kubernetes + Ansible',
    summary:
      'A kubeadm Kubernetes cluster provisioned end to end on KVM with idempotent Ansible playbooks and a DNS/DHCP bastion. Zero configuration drift on repeated runs.',
    description: [
      'End-to-end provisioning of a Kubernetes 1.32 cluster (control plane and worker) on KVM/QEMU virtual machines running Rocky Linux 9, with Ansible as the only configuration tool and a bastion serving BIND9 DNS and DHCP.',
      'Flannel VXLAN overlay networking, firewalld rules and kube-proxy iptables make cross-node pod traffic work; NodePort exposure and CoreDNS service discovery were validated. A GitHub Actions pipeline lints and syntax-checks every playbook on every commit.',
    ],
    highlights: [
      'Idempotent playbooks, zero drift across repeated runs',
      'Kubernetes 1.32 with kubeadm, Flannel VXLAN and containerd',
      'BIND9 and DHCP bastion for the lab network',
      'Ansible lint and syntax validation in CI',
    ],
    stack: ['Ansible', 'Kubernetes 1.32', 'kubeadm', 'Flannel', 'containerd', 'BIND9', 'Rocky Linux 9', 'KVM/QEMU', 'GitHub Actions'],
    context: 'Course project · Infrastructure III',
    date: 'Mar 2026',
    repo: 'https://github.com/Melo088/net-lab-ansible',
  },
  {
    slug: 'cicd-github-actions',
    title: 'CI/CD Pipeline with GitHub Actions: Automated Cloud Deployment',
    shortTitle: 'CI/CD on GitHub Actions',
    summary:
      'Two-job pipeline with a strict gate: tests first, then deploy to S3 and CloudFront provisioned with Terraform, with post-deploy cache invalidation.',
    description: [
      'A two-job pipeline for a React and Vite application. The deploy job only runs when tests pass on a push to main, so every merge is quality-gated before it reaches production.',
      'Terraform provisions S3 static hosting behind a CloudFront CDN. The pipeline invalidates the CloudFront cache after each deploy, and AWS credentials live in GitHub Actions secrets.',
    ],
    highlights: [
      'Test, then deploy, with a mandatory gate',
      'Automatic deploy to S3 + CloudFront on every push to main',
      'Infrastructure defined with Terraform',
      'Post-deploy CloudFront cache invalidation',
    ],
    stack: ['React', 'Vite', 'GitHub Actions', 'Terraform', 'AWS S3', 'CloudFront'],
    context: 'Course project · Infrastructure III',
    date: 'Apr 2026',
    repo: 'https://github.com/Melo088/github-actions-showcase',
  },
  {
    slug: 'gpon-isp-network',
    title: 'ISP-Grade GPON Network: Full Infrastructure Stack',
    shortTitle: 'GPON ISP Network',
    summary:
      'Multi-VLAN dual-stack ISP network on physical MikroTik, Cisco and Huawei GPON hardware, with a virtualized service stack and unified observability.',
    description: [
      'An ISP-grade network on real hardware: MikroTik routing, Cisco switching and a Huawei OLT/ONT GPON plant, with multi-VLAN segmentation and dual-stack IPv4/IPv6 end to end.',
      'Services run virtualized on Ubuntu Server: BIND9 DNS, Kea DHCP, Postfix and Dovecot email, a Caddy reverse proxy with load balancing, and LibreQoS for per-client bandwidth. Prometheus, Grafana and LibreNMS monitor every physical and virtual device over SNMP.',
    ],
    highlights: [
      'Physical hardware: MikroTik, Cisco SG350X, Huawei GPON',
      'Multi-VLAN segmentation with dual-stack IPv4/IPv6',
      'BIND9, Kea DHCP, Postfix/Dovecot, Caddy and LibreQoS',
      'Unified observability with Prometheus, Grafana and LibreNMS',
    ],
    stack: ['MikroTik', 'Cisco', 'Huawei GPON', 'Ubuntu Server', 'BIND9', 'Kea DHCP', 'Caddy', 'LibreQoS', 'Prometheus', 'Grafana', 'LibreNMS'],
    context: 'Course project · Infrastructure II & Platforms I',
    date: 'Nov 2025',
    repo: 'https://github.com/Melo088/ISP-Project',
  },
];

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}
