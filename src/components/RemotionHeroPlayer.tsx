"use client"

import { Player } from "@remotion/player"
import { SulitScanHeroAnimation } from "@/remotion/SulitScanHeroAnimation"

export default function RemotionHeroPlayer() {
  return (
    <Player
      component={SulitScanHeroAnimation}
      durationInFrames={150}
      compositionWidth={560}
      compositionHeight={360}
      fps={30}
      autoPlay
      loop
      style={{
        width: "100%",
        height: "auto",
        borderRadius: "1.25rem",
      }}
      controls={false}
      clickToPlay={false}
      inputProps={{}}
    />
  )
}
