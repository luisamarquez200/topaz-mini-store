/**
 * Dependency Injection Container (Composition Root).
 * Simple manual dependency injection without external libraries.
 */

export interface AppContainer {
  readonly isInitialized: boolean;
}

class Container implements AppContainer {
  public readonly isInitialized: boolean = true;
}

export const container: AppContainer = new Container();
