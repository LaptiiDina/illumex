export type GraphNode = {
  id: string;
  label: string;
  title?:string;
  properties: Record<string, any>;
};

export type Link = {
  source: string;
  target: string;
  type: string;
};

export type GraphData = {
  nodes: GraphNode[];
  links: Link[];
};