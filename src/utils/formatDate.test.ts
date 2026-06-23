import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { formatDate, isOverdue } from "./formatDate";

describe("formatDate utils", () => {
  describe("formatDate", () => {
    it("should format valid YYYY-MM-DD dates to DD MMM YYYY", () => {
      expect(formatDate("2026-07-15")).toBe("15 Jul 2026");
      expect(formatDate("2026-01-01")).toBe("01 Jan 2026");
      expect(formatDate("2026-12-31")).toBe("31 Dec 2026");
    });

    it("should return double-dash for empty or falsy inputs", () => {
      expect(formatDate("")).toBe("—");
      expect(formatDate(null as unknown as string)).toBe("—");
      expect(formatDate(undefined as unknown as string)).toBe("—");
    });
  });

  describe("isOverdue", () => {
    beforeEach(() => {
      // Mock system date to 23 June 2026
      vi.useFakeTimers();
      vi.setSystemTime(new Date("2026-06-23T12:00:00"));
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it("should return true if due date is in the past", () => {
      expect(isOverdue("2026-06-22")).toBe(true);
      expect(isOverdue("2026-05-15")).toBe(true);
    });

    it("should return false if due date is today", () => {
      expect(isOverdue("2026-06-23")).toBe(false);
    });

    it("should return false if due date is in the future", () => {
      expect(isOverdue("2026-06-24")).toBe(false);
      expect(isOverdue("2026-07-15")).toBe(false);
    });

    it("should return false if no due date is provided", () => {
      expect(isOverdue("")).toBe(false);
      expect(isOverdue(null as unknown as string)).toBe(false);
    });
  });
});
