import { render } from "@testing-library/react";

const customRender = (ui: React.ReactElement, options?: any) => {
  render(ui, { ...options });
};

export * from "@testing-library/react";
export { default as userEvent } from "@testing-library/user-event";

export { customRender as render };
