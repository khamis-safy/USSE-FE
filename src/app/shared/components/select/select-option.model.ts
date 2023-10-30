export interface SelectOption {
  title: string;
  value: string | number | boolean | any ;
  children?:
    {
      value: string | number | boolean | any ;
      title: string;
      caption?: string;
      isDisabled?: boolean;
      isDefault?: boolean;
      iconClass?: string;
      startIcon?: string;
      custom?: {
        component: any;
        handler: Function;
      };
      color?: 'primary' | 'success' | 'warning' | 'danger';
      tooltip?: Tooltip;
    }[]

  caption?: string;
  isDisabled?: boolean;
  isDefault?: boolean;
  iconClass?: string;
  startIcon?: string;
  custom?: {
    component: any;
    handler: Function;
  };
  label?: string;
  color?: 'primary' | 'success' | 'warning' | 'danger';
  tooltip?: Tooltip;
  deviceIcon?:any;
}

interface Tooltip {
  iconClass: string;
  text: string;
  boundary?: string;
  maxWidth?: string;
}
