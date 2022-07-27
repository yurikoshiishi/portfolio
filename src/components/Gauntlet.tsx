import React, {
  AnimationEventHandler,
  HTMLProps,
  useEffect,
  useState,
  VFC,
} from "react";

type GauntletProps = Omit<
  HTMLProps<HTMLDivElement>,
  "onClick" | "onAnimationStart" | "onAnimationEnd"
> & {
  onClick?: (type: GauntletType) => void;
  onAnimationStart?: (
    e: React.AnimationEvent,
    props: {
      animationDuration: number;
      type: GauntletType;
      setType: React.Dispatch<React.SetStateAction<GauntletType>>;
    }
  ) => void;
  onAnimationEnd?: (
    e: React.AnimationEvent,
    props: {
      type: GauntletType;
      setType: React.Dispatch<React.SetStateAction<GauntletType>>;
    }
  ) => void;
};

type GauntletType = "idle" | "snap" | "time";

export const GAUNTLET_IMAGE_PATHS: { [key in GauntletType]: string } = {
  idle: "/assets/snap/thanos_idle.png",
  snap: "/assets/snap/thanos_snap.png",
  time: "/assets/snap/thanos_time.png",
};

const GAUNTLET_ANIMATION_NAMES: { [key in GauntletType]: GauntletType } = {
  idle: "idle",
  snap: "snap",
  time: "time",
};

const GAUNTLET_ANIMATION_DURATION_IN_MS = 2000;

const Gauntlet: VFC<GauntletProps> = ({
  onAnimationStart,
  onAnimationEnd,
  onClick,
  ...props
}) => {
  const [type, setType] = useState<GauntletType>("idle");

  useEffect(() => {
    [GAUNTLET_IMAGE_PATHS.snap, GAUNTLET_IMAGE_PATHS.time].forEach((path) => {
      const image = new Image();
      image.src = path;
    });
  }, []);

  const handleClick = () => {
    let nextType: GauntletType = "idle";
    if (type === "idle" || type === "time") {
      nextType = "snap";
    }
    if (type === "snap") {
      nextType = "time";
    }
    setType(nextType);
    onClick?.(nextType);
  };

  const handleAnimationStart: AnimationEventHandler = (e) => {
    if (
      e.animationName === GAUNTLET_ANIMATION_NAMES.snap ||
      e.animationName === GAUNTLET_ANIMATION_NAMES.time
    ) {
      onAnimationStart?.(e, {
        animationDuration: GAUNTLET_ANIMATION_DURATION_IN_MS,
        setType,
        type: e.animationName,
      });
    }
  };

  const handleAnimationEnd: AnimationEventHandler = (e) => {
    if (
      e.animationName === GAUNTLET_ANIMATION_NAMES.snap ||
      e.animationName === GAUNTLET_ANIMATION_NAMES.time
    ) {
      onAnimationEnd?.(e, {
        setType,
        type: e.animationName,
      });
    }
  };

  return (
    <div
      {...props}
      className={`gauntlet ${type} ${props.className || ""}`}
      onClick={handleClick}
      onAnimationStart={handleAnimationStart}
      onAnimationEnd={handleAnimationEnd}
    >
      <style>
        {`
                .gauntlet {
                    display: inline-block;
                    background-image: url('${GAUNTLET_IMAGE_PATHS.idle}');
                    background-size: cover;
                    cursor: pointer;
                }

                .gauntlet.snap {
                    background-position: left;
                    background-repeat: no-repeat;
                    background-image: url('${GAUNTLET_IMAGE_PATHS.snap}');
                    animation: snap ${GAUNTLET_ANIMATION_DURATION_IN_MS}ms steps(47);
                }

                .gauntlet.time {
                    background-position: left;
                    background-repeat: no-repeat;
                    background-image: url('${GAUNTLET_IMAGE_PATHS.time}');
                    animation: time ${GAUNTLET_ANIMATION_DURATION_IN_MS}ms steps(47);
                }

                @keyframes snap {
                    from {
                        background-position: left;
                    }
                    to {
                        background-position: right;
                    }
                }

                @keyframes time {
                    from {
                        background-position: left;
                    }
                    to {
                        background-position: right;
                    }
                }
            `}
      </style>
    </div>
  );
};

export default Gauntlet;
