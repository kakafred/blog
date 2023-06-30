type Social = {
  label: string;
  link: string;
};

type Presentation = {
  mail: string;
  title: string;
  description: string;
  socials: Social[];
};

const presentation: Presentation = {
  mail: "kaka.fred@outlook.com",
  title: "",
  description:
    "Hi, I'm an **Cloud solution architect**. I have been working in the cloud computing industry for 5 years. I am committed to providing customers with **reliable**, **secure**, and **cost-effective** Cloud workloads, and solving workload **problems** and **failures** for customers on Public Cloud Platform.",
  socials: [
    {
      label: "Github",
      link: "https://github.com/kakafred",
    },
    {
      label: "WeChat",
      link: "wecaht"
    }
  ],
};

export default presentation;
