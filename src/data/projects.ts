export type Project = {
  title: string;
  techs: string[];
  link: string;
  type: string;
  isComingSoon?: boolean;
};

const projects: Project[] = [
  {
    title: "AWS Primary Support Plan",
    techs: ["EC2", "RDS", "VPC", "EBS", "One-time payment"],
    link: "#",
    type: "AWS",
  },
  {
    title: "AWS Advanced Support Plan",
    techs: ["Computing", "Databases", "Storage", "Middleware", "One-time payment"],
    link: "#",
    type: "AWS",
  },
  {
    title: "AWS Premium Support Plan",
    techs: ["Industry Solutions", "Cost Optimization", "Security & Compliance"],
    link: "#",
    type: "AWS",
  },
  {
    title: "Azure Primary Support Plan",
    techs: ["Computing"],
    link: "/",
    type: "Azure",
    isComingSoon: true,
  },
];

export default projects;
