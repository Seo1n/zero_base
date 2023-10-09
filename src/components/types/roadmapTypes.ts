export interface Id {
    id?: number;
  }
  
  // enum Position {
  //   Left = 'left',
  //   Top = 'top',
  //   Right = 'right',
  //   Bottom = 'bottom',
  // }
  
  export interface DataProps {
    children?: string;
    ref?: string | unknown;
  }
  

  export interface XYPosition {
    x: number;
    y: number;
    zoom?: number;
  }
  
  export interface AddedNode {
    id: string;
    height: number;
    width: number;
    dragging?: boolean;
    selected?: boolean;
    position: XYPosition;
    targetPosition?: string;
    sourcePosition?: string;
    // type?: string | any;
    type?: string;
    toolbarPosition?: string;
    data?: { label: string };
  
    positionAbsolute?: XYPosition;
  }
  
  export interface nodeStyle {
    background?: string;
    border?: string;
    borderRadius?: number;
    fontSize?: number;
  }
  export interface RoadmapNode {
    id: string;
    type?: string;
    isJoined?: boolean;
    position: XYPosition;
    data: { label: string };
    style?: nodeStyle;
    done?: boolean;
    content?: string;
    targetPosition?: string;
    sourcePosition?: string;
    selected?: boolean;
    detailedContent?: string;
    positionAbsolute?: XYPosition;
    dragging?: boolean;
  }
  
  export type RoadmapNodes = RoadmapNode[];
  
  export interface RoadmapEdge {
    id: string;
    source: string;
    target: string;
    type: string;
    animated: boolean;
  }
  export type RoadmapEdges = RoadmapEdge[];
  export type zoom = number;
  // export type Viewport = XYPosition | zoom | null;
  
  export interface Viewport {
    x: number;
    y: number;
    zoom: number;
  }
  
  export interface NewRoadmap {
    title?: string;
    description?: string;
    recommendedExecutionTimeValue?: number;
    recommendedExecutionTimeUnit?: string;
    edges?: RoadmapEdges | [];
    nodes?: RoadmapNodes;
    detailedContent?: string;
    // nodes: RoadmapNodes | [];
    viewport?: Viewport;
  }
  
  export type Roadmap = NewRoadmap & Id;
  