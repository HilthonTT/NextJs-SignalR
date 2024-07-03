import { Channel } from "@/components/channel";

type Props = {
  params: {
    channelId: string;
  };
};

const ChannelIdPage = ({ params }: Props) => {
  return <Channel channelId={params.channelId} />;
};

export default ChannelIdPage;
