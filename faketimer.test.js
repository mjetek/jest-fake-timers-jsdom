beforeEach(() => {
  jest.useFakeTimers("modern");
});

afterEach(() => {
  jest.runOnlyPendingTimers();
  jest.useRealTimers();
});

test("File Reader readAsText should resolve before long timeots", async () => {
  const fr = new FileReader();

  const frPromise = new Promise((resolve) => {
    fr.onload = () => resolve("file reader resolved");
  });

  const setTimeoutsPromise = new Promise((resolve) =>
    setTimeout(() => setTimeout(() => resolve("setTimeout resolved"), 300), 300)
  );

  fr.readAsText(new Blob(["test"]), "utf-8");

  jest.advanceTimersByTime(1000);

  const firstPromise = await Promise.race([setTimeoutsPromise, frPromise]);
  expect(firstPromise).toBe("file reader resolved");
});
