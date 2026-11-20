import React from "react";
import "./ThemeTypographyShowcase.css";

const headline = (
  <>
    Every US
    <br />
    accounting <span className="theme-showcase__amp">&amp;</span> tax
    <br />
    service, under
    <br />
    <span className="theme-showcase__highlight">one</span> outsourcing
    <br />
    relationship.
  </>
);

export default function ThemeTypographyShowcase() {
  return (
    <section className="theme-showcase" aria-label="Light and dark theme typography preview">
      <article className="theme-showcase__panel theme-showcase__panel--dark">
        <h1 className="theme-showcase__heading theme-showcase__heading--dark">
          {headline}
        </h1>
      </article>

      <article className="theme-showcase__panel theme-showcase__panel--light">
        <h1 className="theme-showcase__heading theme-showcase__heading--light">
          {headline}
        </h1>
      </article>
    </section>
  );
}
