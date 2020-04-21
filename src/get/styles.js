module.exports.styles = `
:root {
  --dark: #5389a6;
  --light: #a6dcee;
}

body {
  font-family: "Oxygen", sans-serif;
  color: var(--dark);
}

main {
  width: fit-content;
}

#input {
  display: none;
}

.inputfile-1 + label {
  background-color: var(--light);
  transition: all 0.5s ease;
}

.inputfile-1:focus + label,
.inputfile-1.has-focus + label,
.inputfile-1 + label:hover {
  background-color: #b0ebff;
}

.inputfile + label {
  max-width: 80%;
  font-size: 1.25rem;
  font-weight: 700;
  text-overflow: ellipsis;
  white-space: nowrap;
  cursor: pointer;
  display: inline-block;
  overflow: hidden;
  padding: 0.625rem 1.25rem;
  margin-bottom: 5px;
}

.inputfile + label svg {
  margin-right: 0.25rem;
  fill: var(--dark);
}

#loader {
  display: none;
  overflow: hidden;
}

.loading {
  width: 214px;
  height: 16px;
  position: relative;
}

.loading p {
  top: 0;
  padding: 0;
  margin: 0;
  color: var(--dark);
  animation: text 3.5s ease both infinite;
  font-size: 12px;
  letter-spacing: 1px;
}

.loading span {
  background-color: var(--dark);
  display: block;
  height: 16px;
  width: 214px;
  bottom: 0;
  position: absolute;
  transform: translateX(64px);
  animation: loading 3.5s ease both infinite;
}

.loading span:before {
  position: absolute;
  content: "";
  width: 100%;
  height: 100%;
  background-color: var(--light);
  animation: loading2 3.5s ease both infinite;
}

@keyframes loading {
  0% {
    width: 16px;
    transform: translateX(0px);
  }

  40% {
    width: 100%;
    transform: translateX(0px);
  }

  80% {
    width: 16px;
    transform: translateX(197px);
  }

  90% {
    width: 100%;
    transform: translateX(0px);
  }

  100% {
    width: 16px;
    transform: translateX(0px);
  }
}

@keyframes loading2 {
  0% {
    transform: translateX(0px);
    width: 16px;
  }

  40% {
    transform: translateX(25%);
    width: 60%;
  }

  80% {
    width: 100%;
    transform: translateX(0px);
  }

  90% {
    width: 80%;
    transform: translateX(16px);
  }

  100% {
    transform: translateX(0px);
    width: 16px;
  }
}
`;
