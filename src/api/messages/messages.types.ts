export type Messages = {
  Metadata: Metadata;
  Common: Common;
  Home: Home;
  Question: Question;
  Result: Result;
};

export type Common = {
  loading: string;
};

export type Home = {
  title: string;
  headline: string;
  caption: string;
  start: string;
  fields: Fields;
};

export type Fields = {
  email: Field;
  group: Field;
  name: Field;
};

export type Field = {
  label: string;
  placeholder: string;
};

export type Metadata = {
  applicationName: string;
  keywords: string;
  creator: string;
  publisher: string;
  title: Title;
  description: string;
};

export type Title = {
  default: string;
  template: string;
};

export type Question = {
  next: string;
  back: string;
  finish: string;
};

export type Result = {
  headline: string;
  caption: string;
  score: string;
  download: Download;
};

export type Download = {
  caption: string;
  button: string;
};
