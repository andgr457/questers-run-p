import React from 'react';
import "./AnimatedText.css";

type AnimatedTextProps = {
  children: React.ReactNode;
  speed?: number;
  className?: string;
};

let globalIndex = 0;

export const AnimatedText: React.FC<AnimatedTextProps> = ({
  children,
  speed = 20,
  className = "",
}) => {
  globalIndex = 0;

  const wrapLetters = (node: React.ReactNode): React.ReactNode => {
    // If it's plain text → split into letters
    if (typeof node === "string") {
      return node.split("").map((char) => {
        const index = globalIndex++;
        return (
          <span
            key={index}
            className="animated-letter"
            style={
              {
                "--i": index,
                "--speed": `${speed}ms`,
              } as React.CSSProperties
            }
          >
            {char === " " ? "\u00A0" : char}
          </span>
        );
      });
    }

    // If it's an array → recurse
    if (Array.isArray(node)) {
      return node.map((child, i) => (
        <React.Fragment key={i}>{wrapLetters(child)}</React.Fragment>
      ));
    }

    // If it's a valid React element → clone and recurse its children
    if (React.isValidElement(node)) {
      const element = node as React.ReactElement<{ children?: React.ReactNode }>;

      return React.cloneElement(element, {
        children: wrapLetters(element.props.children),
      });
    }

    // Otherwise (null, boolean, etc)
    return node;
  };

  return (
    <span className={`animated-text ${className}`}>
      {wrapLetters(children)}
    </span>
  );
};