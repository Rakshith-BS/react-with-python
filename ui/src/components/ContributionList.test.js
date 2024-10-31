import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import ContributionList from "./ContributionList";

// Ensure proper cleanup after each test
afterEach(cleanup);

test("navigates through pagination", async () => {
  // Mock more contributions for pagination
  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: true,
      json: () =>
        Promise.resolve(
          new Array(30).fill(0).map((_, index) => ({
            id: index + 1,
            title: `Contribution ${index + 1}`,
            description: "A great contribution",
            start_time: "2023-11-01T12:00:00",
            end_time: "2023-11-01T13:00:00",
            owner: `Owner ${index + 1}`,
            status: "Scheduled",
          }))
        ),
    })
  );

  render(<ContributionList />);

  // Wait for contributions to be displayed
  console.log(contributions);
  const contributions = await screen.findAllByRole("heading", { level: 3 });
  expect(contributions).toHaveLength(14); // 14 contributions per page by default

  // Navigate to the next page
  const nextButton = screen.getByText("Next");
  fireEvent.click(nextButton);

  // Wait for the new page contributions
  const newContributions = await screen.findAllByRole("heading", { level: 3 });
  expect(newContributions).toHaveLength(14); // Should load the next 14 contributions

  // Check that the current page is updated
  const pageIndicator = screen.getByText("Page 2");
  expect(pageIndicator).toBeInTheDocument();
});
