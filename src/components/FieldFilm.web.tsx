import { useState } from "react";
import { RuralPhoto } from "./RuralPhoto";

export function FieldFilm() {
  const [playing, setPlaying] = useState(false);
  const [failed, setFailed] = useState(false);
  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        background: "#102F25",
      }}
    >
      <RuralPhoto />
      {playing && !failed && (
        <video
          autoPlay
          muted
          playsInline
          controls
          preload="none"
          aria-label="Vista aérea de uma lavoura"
          onError={() => {
            setFailed(true);
            setPlaying(false);
          }}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
          src="https://videos.pexels.com/video-files/4907896/4907896-hd_1920_1080_30fps.mp4"
        />
      )}
      {!playing && (
        <button
          onClick={() => setPlaying(true)}
          disabled={failed}
          style={{
            position: "absolute",
            bottom: 24,
            left: 24,
            padding: "14px 22px",
            borderRadius: 32,
            border: "1px solid #ffffff80",
            background: "#102f25e6",
            color: "white",
            cursor: "pointer",
            font: "inherit",
          }}
        >
          {failed
            ? "Vídeo indisponível — aproveite a paisagem"
            : "▶  Ver o campo em movimento"}
        </button>
      )}
    </div>
  );
}
