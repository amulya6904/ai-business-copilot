import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeftRight,
  CalendarClock,
  LoaderCircle,
  Search,
  Wand2,
} from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { formatDateInput } from "../lib/utils";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

const formSchema = z
  .object({
    metric: z.string().min(1, "Choose or enter a metric."),
    period_a_start: z.string().min(1, "Pick a start date."),
    period_a_end: z.string().min(1, "Pick an end date."),
    period_b_start: z.string().min(1, "Pick a start date."),
    period_b_end: z.string().min(1, "Pick an end date."),
  })
  .superRefine((values, ctx) => {
    if (values.period_a_start > values.period_a_end) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["period_a_end"],
        message: "Period A end must be on or after Period A start.",
      });
    }
    if (values.period_b_start > values.period_b_end) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["period_b_end"],
        message: "Period B end must be on or after Period B start.",
      });
    }
  });

const metrics = [
  "revenue",
  "revenue_daily",
  "revenue_by_category",
  "revenue_by_region",
  "revenue_by_sub_category",
];

function defaultValues() {
  return {
    metric: "revenue",
    period_a_start: "2017-01-01",
    period_a_end: "2017-01-31",
    period_b_start: "2016-01-01",
    period_b_end: "2016-01-31",
  };
}

function buildQuickRange() {
  const today = new Date();
  const startCurrent = new Date(today.getFullYear(), today.getMonth() - 1, 1);
  const endCurrent = new Date(today.getFullYear(), today.getMonth(), 0);
  const startPrevious = new Date(
    startCurrent.getFullYear() - 1,
    startCurrent.getMonth(),
    1,
  );
  const endPrevious = new Date(
    endCurrent.getFullYear() - 1,
    endCurrent.getMonth(),
    endCurrent.getDate(),
  );

  return {
    period_a_start: formatDateInput(startCurrent),
    period_a_end: formatDateInput(endCurrent),
    period_b_start: formatDateInput(startPrevious),
    period_b_end: formatDateInput(endPrevious),
  };
}

export function InsightForm({ loading, initialValues, onSubmit }) {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    getValues,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: initialValues || defaultValues(),
  });

  useEffect(() => {
    if (initialValues) {
      reset(initialValues);
    }
  }, [initialValues, reset]);

  const applyQuickRange = () => {
    const range = buildQuickRange();
    Object.entries(range).forEach(([key, value]) => setValue(key, value));
  };

  const swapPeriods = () => {
    const values = getValues();
    setValue("period_a_start", values.period_b_start);
    setValue("period_a_end", values.period_b_end);
    setValue("period_b_start", values.period_a_start);
    setValue("period_b_end", values.period_a_end);
  };

  const fieldClassName =
    "mt-2 h-12 w-full rounded-2xl border border-line bg-white px-4 text-sm text-ink outline-none transition focus:border-accent focus:ring-4 focus:ring-accent/10";

  return (
    <Card className="min-h-[620px]">
      <CardHeader>
        <CardTitle>Insight Builder</CardTitle>
        <p className="mt-1 text-sm text-slate-500">
          This form maps directly to the existing request payload expected by
          the FastAPI endpoint.
        </p>
      </CardHeader>
      <CardContent>
        <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label className="text-sm font-semibold text-ink" htmlFor="metric">
              Metric
            </label>
            <div className="relative">
              <Search className="pointer-events-none absolute left-4 top-[1.15rem] h-4 w-4 text-slate-400" />
              <input
                className={`${fieldClassName} pl-11`}
                id="metric"
                list="metric-options"
                placeholder="Search or type a metric"
                {...register("metric")}
              />
              <datalist id="metric-options">
                {metrics.map((metric) => (
                  <option key={metric} value={metric} />
                ))}
              </datalist>
            </div>
            <p className="mt-2 text-xs text-slate-500">
              Start with `revenue`, then branch into category, region, or
              sub-category comparisons.
            </p>
            <AnimatePresence>
              {errors.metric ? (
                <motion.p
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-2 text-sm text-danger"
                  exit={{ opacity: 0, y: -4 }}
                  initial={{ opacity: 0, y: -4 }}
                >
                  {errors.metric.message}
                </motion.p>
              ) : null}
            </AnimatePresence>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-sm font-semibold text-ink" htmlFor="period_a_start">
                Period A start
              </label>
              <input
                className={fieldClassName}
                id="period_a_start"
                type="date"
                {...register("period_a_start")}
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-ink" htmlFor="period_a_end">
                Period A end
              </label>
              <input
                className={fieldClassName}
                id="period_a_end"
                type="date"
                {...register("period_a_end")}
              />
              {errors.period_a_end ? (
                <p className="mt-2 text-sm text-danger">{errors.period_a_end.message}</p>
              ) : null}
            </div>
            <div>
              <label className="text-sm font-semibold text-ink" htmlFor="period_b_start">
                Period B start
              </label>
              <input
                className={fieldClassName}
                id="period_b_start"
                type="date"
                {...register("period_b_start")}
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-ink" htmlFor="period_b_end">
                Period B end
              </label>
              <input
                className={fieldClassName}
                id="period_b_end"
                type="date"
                {...register("period_b_end")}
              />
              {errors.period_b_end ? (
                <p className="mt-2 text-sm text-danger">{errors.period_b_end.message}</p>
              ) : null}
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <LoaderCircle className="h-4 w-4 animate-spin" />
                  Generating insight
                </>
              ) : (
                <>
                  <Wand2 className="h-4 w-4" />
                  Generate Insight
                </>
              )}
            </Button>
            <Button type="button" onClick={swapPeriods} variant="secondary">
              <ArrowLeftRight className="h-4 w-4" />
              Swap periods
            </Button>
            <Button type="button" onClick={applyQuickRange} variant="ghost">
              <CalendarClock className="h-4 w-4" />
              Quick ranges
            </Button>
          </div>

          <div className="rounded-3xl border border-line bg-mist/70 p-4 text-sm text-slate-500">
            Quick ranges use the previous calendar month versus the same month
            one year earlier, and only populate the form client-side.
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
