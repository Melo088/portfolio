/**
 * Única fuente de datos del sitio. Todo el contenido visible vive aquí:
 * las páginas y componentes solo leen de este archivo.
 *
 * Para reemplazar los placeholders de imagen: sube tu archivo real a
 * `public/images/...` y actualiza la ruta correspondiente (campo `image`
 * de cada proyecto, o `portrait` abajo).
 *
 * Regla de estilo del copy: inglés, sin em dashes (usar punto, coma o dos
 * puntos en su lugar).
 */

export interface Project {
  slug: string;
  title: string;
  /** Título corto para tarjetas y navegación entre proyectos. */
  shortTitle: string;
  /** Una línea para la tarjeta en el home. */
  summary: string;
  /** Párrafos para la página de detalle. */
  description: string[];
  highlights: string[];
  stack: string[];
  /** URL del repositorio. TODO: agregar las URLs reales. */
  repo?: string;
  /** Ruta bajo /public. Reemplazar el .svg placeholder por la foto real. */
  image: string;
  year: string;
}

export interface SkillGroup {
  label: string;
  items: string[];
}

export const site = {
  name: 'Juan Camilo Melo',
  /** Líneas del wordmark del hero (canvas halftone, Arial Black). */
  wordmark: ['Juan Camilo', 'Melo'],
  taglines: [
    'CLOUD & DEVOPS ENGINEERING',
    'INFRASTRUCTURE, AUTOMATION AND SOFTWARE FROM SCRATCH',
  ],
  bio: 'Telematics Engineering student at Universidad Icesi (Cali, class of 2027), focused on cloud, DevOps, and full-stack development. I build everything from automated Kubernetes clusters to CI/CD pipelines and serverless architectures on AWS, taking every project from the infrastructure up to production code.',
  email: 'jcml29310@gmail.com',
  github: 'https://github.com/Melo088',
  githubHandle: 'MELO088',
  linkedin: 'https://linkedin.com/in/juan-camilo-melo',
  cvPath: '/cv.pdf',
  /** Foto personal para /about. Reemplazar el placeholder por tu foto real. */
  portrait: '/images/portrait-placeholder.svg',
  education: {
    school: 'Universidad Icesi, Cali, Colombia',
    degree: 'Telematics Engineering',
    graduation: '2027',
  },
} as const;

export const skillGroups: SkillGroup[] = [
  {
    label: 'Cloud',
    items: [
      'AWS (EC2, ASG, RDS, S3, CloudFront, CloudFormation, CloudWatch, SNS, Lambda, API Gateway, Cognito, DynamoDB, CloudTrail)',
      'GCP (Compute Engine, VPC, Load Balancing, Cloud Run)',
    ],
  },
  {
    label: 'DevOps & Automation',
    items: [
      'GitHub Actions',
      'Ansible',
      'Docker',
      'Kubernetes',
      'Terraform',
      'Bash',
      'CI/CD',
      'KVM/QEMU',
    ],
  },
  {
    label: 'Backend',
    items: [
      'Java 21',
      'Spring Boot',
      'Spring Security',
      'JWT',
      'REST APIs',
      'Python',
      'PostgreSQL',
    ],
  },
  {
    label: 'Frontend',
    items: ['React', 'Vite', 'Tailwind CSS', 'JavaScript/TypeScript', 'Flutter'],
  },
];

export const certifications = [
  'Cisco DevNet Associate',
  'AWS Academy Cloud Foundations',
  'AWS Cloud Operations (in progress)',
  'Google Cloud Computing Foundations',
  'Google Cybersecurity Certificate',
];

/** Cinta de skills para el ticker del home (nombres cortos, alto contraste). */
export const tickerSkills = [
  'AWS',
  'KUBERNETES',
  'TERRAFORM',
  'ANSIBLE',
  'DOCKER',
  'GITHUB ACTIONS',
  'SPRING BOOT',
  'PYTHON',
  'REACT',
  'SERVERLESS',
  'CI/CD',
  'GCP',
];

export const projects: Project[] = [
  {
    slug: 'ecommerce-aws-iac',
    title: 'E-Commerce Platform: Full Stack + AWS IaC',
    shortTitle: 'E-Commerce + AWS IaC',
    summary:
      'E-commerce platform with JWT auth, deployed across 10 CloudFormation stacks with auto-scaling, a CDN, and an integrated payment gateway.',
    description: [
      'A complete e-commerce platform, from the data model to the infrastructure running in production. The Java 21 backend built on Spring Boot exposes a REST API protected with JWT and Spring Security. The React 18 frontend, styled with Tailwind, consumes the API and handles the full purchase flow, including the payment gateway.',
      'All the infrastructure is defined as code: 10 CloudFormation stacks provision the network, the EC2 auto-scaling group, the RDS PostgreSQL database, the ALB load balancer, and the CloudFront distribution over S3. Nothing was created by hand in the console.',
    ],
    highlights: [
      '10 CloudFormation stacks, 100% reproducible infrastructure',
      'Auto-scaling with an EC2 ASG behind an ALB',
      'CDN with CloudFront + S3 for the frontend',
      'JWT authentication with Spring Security',
      'Integrated payment gateway',
    ],
    stack: [
      'Java 21',
      'Spring Boot',
      'React 18',
      'Tailwind',
      'PostgreSQL',
      'CloudFormation',
      'EC2 ASG',
      'RDS',
      'ALB',
      'CloudFront',
      'S3',
    ],
    repo: undefined, // TODO: agregar URL del repo
    image: '/images/projects/ecommerce-aws-iac.svg',
    year: '2025',
  },
  {
    slug: 'icesiscore-serverless',
    title: 'IcesiScore: Real-Time Serverless Scores Platform',
    shortTitle: 'IcesiScore Serverless',
    summary:
      'Serverless AWS backend pushing live sports scores over WebSockets, plus a Flutter mobile app built with Clean Architecture.',
    description: [
      'A real-time sports results platform for Universidad Icesi. The backend is fully serverless: Python Lambda functions behind API Gateway WebSocket push score updates to connected clients the moment they happen, with no polling.',
      'Authentication runs on Cognito, hot data lives in DynamoDB, and historical data in RDS. All the infrastructure is provisioned with Terraform. The mobile app, built in Flutter with Clean Architecture, separates domain, data, and presentation layers to keep the code testable.',
    ],
    highlights: [
      'WebSockets over API Gateway, live updates without polling',
      '100% serverless architecture on AWS Lambda',
      'Infrastructure provisioned with Terraform',
      'Flutter mobile app with Clean Architecture',
    ],
    stack: [
      'Python',
      'AWS Lambda',
      'API Gateway WebSocket',
      'Cognito',
      'DynamoDB',
      'RDS',
      'Terraform',
      'Flutter',
    ],
    repo: undefined, // TODO: agregar URL del repo
    image: '/images/projects/icesiscore-serverless.svg',
    year: '2025',
  },
  {
    slug: 'kubernetes-ansible',
    title: 'Kubernetes Cluster: End-to-End Ansible Provisioning',
    shortTitle: 'Kubernetes + Ansible',
    summary:
      'Production-grade cluster provisioned end to end with Ansible on KVM/QEMU, with zero configuration drift across repeated runs.',
    description: [
      'End-to-end provisioning of a production-grade Kubernetes 1.32 cluster using Ansible as the only configuration tool, on KVM/QEMU virtual machines running Rocky Linux.',
      'The playbooks are idempotent: repeated runs produce zero configuration drift, verified in CI with GitHub Actions. Cluster networking uses Flannel as the CNI and containerd as the runtime, mirroring the decisions of a real production environment.',
    ],
    highlights: [
      'Idempotent playbooks, zero drift across repeated runs',
      'Kubernetes 1.32 with Flannel CNI and containerd',
      'Idempotence verified in CI with GitHub Actions',
      'Virtualization with KVM/QEMU on Rocky Linux',
    ],
    stack: [
      'Ansible',
      'Kubernetes 1.32',
      'Flannel CNI',
      'containerd',
      'Rocky Linux',
      'GitHub Actions',
      'KVM/QEMU',
    ],
    repo: undefined, // TODO: agregar URL del repo
    image: '/images/projects/kubernetes-ansible.svg',
    year: '2024',
  },
  {
    slug: 'cicd-github-actions',
    title: 'CI/CD Pipeline with GitHub Actions',
    shortTitle: 'CI/CD Pipeline',
    summary:
      'Two-stage pipeline (test, then deploy) with automatic deployment to S3 + CloudFront via Terraform and post-deploy cache invalidation.',
    description: [
      'A continuous integration and deployment pipeline for a React application built with Vite. Two chained stages: tests must pass before the deploy triggers, and every push to main ends up published in production with no manual steps.',
      'The deploy uploads the build to S3 and serves it through CloudFront. Terraform defines the infrastructure, and the last step of the pipeline invalidates the distribution cache so changes become visible immediately.',
    ],
    highlights: [
      'Two stages, test then deploy, with a mandatory gate',
      'Automatic deploy to S3 + CloudFront on every push to main',
      'Infrastructure defined with Terraform',
      'Post-deploy CloudFront cache invalidation',
    ],
    stack: ['React', 'Vite', 'GitHub Actions', 'Terraform', 'AWS S3', 'CloudFront'],
    repo: undefined, // TODO: agregar URL del repo
    image: '/images/projects/cicd-github-actions.svg',
    year: '2024',
  },
  {
    slug: 'gpon-isp-network',
    title: 'ISP-Grade GPON Network',
    shortTitle: 'GPON ISP Network',
    summary:
      'Dual-stack, multi-VLAN ISP network on physical hardware (MikroTik, Cisco, Huawei GPON) with a Prometheus + Grafana + LibreNMS observability stack.',
    description: [
      'Design and build-out of an ISP-grade network on real physical hardware: MikroTik routers, Cisco switching, and a Huawei GPON plant, with multi-VLAN segmentation and end-to-end dual-stack IPv4/IPv6 addressing.',
      'The network is operated with a full observability stack: Prometheus for metrics, Grafana for dashboards, and LibreNMS for network device discovery and monitoring. The same tooling a real service provider would run.',
    ],
    highlights: [
      'Real physical hardware: MikroTik, Cisco, Huawei GPON',
      'Multi-VLAN segmentation with dual-stack IPv4/IPv6',
      'Observability with Prometheus + Grafana + LibreNMS',
    ],
    stack: [
      'MikroTik',
      'Cisco',
      'Huawei GPON',
      'VLAN',
      'IPv4/IPv6',
      'Prometheus',
      'Grafana',
      'LibreNMS',
    ],
    repo: undefined, // TODO: agregar URL del repo
    image: '/images/projects/gpon-isp-network.svg',
    year: '2024',
  },
];

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}
