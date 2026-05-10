import React, { type ReactNode } from "react";
import "./JumpyText.css";

type JumpyTextProps = {
  children: ReactNode;
  speed?: number;
  className?: string;
};

let globalIndex = 0;

export const JumpyText: React.FC<JumpyTextProps> = ({
  children,
  speed = 30,
  className = "",
}) => {
  globalIndex = 0;

  const wrapLetters = (node: ReactNode): ReactNode => {
    if (typeof node === "string") {
      return node.split("").map((char) => {
        const index = globalIndex++;

        const jumpDuration = 1.2; // fixed
        const jumpDelay = index * 0.08 + Math.random() * 0.2;

        return (
          <span
            key={index}
            className="jumpy-letter"
            style={
              {
                "--i": index,
                "--speed": `${speed}ms`,
               
                "--jump-delay": `${jumpDelay}s`,
                "--jump-duration": `${jumpDuration}s`,
              } as React.CSSProperties
            }
          >
            {char === " " ? "\u00A0" : char}
          </span>
        );
      });
    }

    if (Array.isArray(node)) {
      return node.map((child, i) => (
        <React.Fragment key={i}>{wrapLetters(child)}</React.Fragment>
      ));
    }

    if (React.isValidElement(node)) {
      const element = node as React.ReactElement<{ children?: React.ReactNode }>;
      return React.cloneElement(element, {
        children: wrapLetters(element.props.children),
      });
    }

    return node;
  };

  return (
    <span className={`jumpy-text ${className}`}>
      {wrapLetters(children)}
    </span>
  );
};