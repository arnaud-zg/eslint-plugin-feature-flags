/** A flag as the config declares it. Without `expires`, the flag is permanent. */
export interface FlagDefinition {
  /** The last day the flag may live, as `YYYY-MM-DD`. */
  expires?: string;
  description?: string;
}

/** Every flag the project knows, by name. */
export type FlagDefinitions = Record<string, FlagDefinition>;

const pad = (value: number) => String(value).padStart(2, "0");

/** `today` as `YYYY-MM-DD` in local time, the form `expires` is written in. */
const localDay = (today: Date) =>
  `${today.getFullYear()}-${pad(today.getMonth() + 1)}-${pad(today.getDate())}`;

/** A flag expires the day after its `expires` date. A permanent flag never does. */
export const isExpired = (definition: FlagDefinition, today: Date): boolean =>
  definition.expires !== undefined && definition.expires < localDay(today);

/** Whether the project declares this flag. */
export const isDefined = (definitions: FlagDefinitions, name: string): boolean =>
  Object.hasOwn(definitions, name);
