import { createGlobalStyle } from "styled-components";

export const GlobalStyle = createGlobalStyle`
 body {
  background: rgb(104, 72, 142);
  font-size: 16px;
  font-family: Rubik, Roboto, sans-serif;
  padding: 0;
  margin: 0;
  overflow-x: hidden;
  color: rgb(48, 43, 43);
}

h1,
h2,
h3,
h4,
h5,
h6,
p {
  margin: 0;
  padding: 0;
  font-size: 16px;
  line-height: 24px;
}

* {
  box-sizing: border-box;
}

img {
  max-width: 100%;
  height: auto;
}

input,
button {
  border: none;
  background: none;
  outline: none;
  color: rgb(48, 43, 43);
  font-size: 16px;
  font-family: Rubik, Roboto, sans-serif;
}

a {
  color: rgb(48, 43, 43);
  text-decoration: none;
}

ul,
li {
  padding: 0;
  margin: 0;
  list-style: none;
}

.container {
  width: 1240px;
  margin: 0 auto;
  min-height: 100vh;
}
`;
