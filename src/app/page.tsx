import { FeedView } from "@/components/feed/feed-view";
import { LOTS } from "@/lib/data";
import { lotFeedPoster } from "@/lib/feed-media";
import { lotUsesVideo } from "@/lib/lot-media";

function FirstSlidePreload() {
  const lot = LOTS[0];
  if (!lot) return null;
  const poster = lotFeedPoster(lot);
  return (
    <>
      <link rel="preload" as="image" href={poster} fetchPriority="high" />
      {lotUsesVideo(lot) && lot.media.videoUrl ? (
        <link rel="preload" as="fetch" href={lot.media.videoUrl} crossOrigin="anonymous" />
      ) : null}
    </>
  );
}

export default function Home() {
  return (
    <>
      <FirstSlidePreload />
      <FeedView />
    </>
  );
}
