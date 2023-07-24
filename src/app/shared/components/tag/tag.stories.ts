import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Meta, moduleMetadata, Story } from '@storybook/angular';
import { TagComponent } from './tag.component';

export default {
  title: 'Layout/Tags & Status/Tags',
  component: TagComponent,
  decorators: [
    moduleMetadata({
      declarations: [TagComponent],
      imports: [],
    }),
  ],
} as Meta;



const Template: Story<any> = (args: any) => ({
  props: args
});

export const Default = Template.bind({});
Default.args = {
  title: "Tagname",
}

export const Badge = Template.bind({});
Badge.args = {
  title: "Tagname",
  readonly: true
};

export const Danger = Template.bind({});
Danger.args = {
  title: "Tagname",
  state : "danger"
}

export const Warning = Template.bind({});
Warning.args = {
  title: "Tagname",
  state : "warning"
}

export const Success = Template.bind({});
Success.args = {
  title: "Tagname",
  state : "success"
}

export const Neutral = Template.bind({});
Neutral.args = {
  title: "Tagname",
  state : "neutral"
}

