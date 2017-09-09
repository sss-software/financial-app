import * as ko from 'knockout';
import AppContext from './AppContext';

export enum LoadingStatus {
    Loading = 0,

    Error = 1,

    Done = 2
}

export type ActivationPromise = Promise<void>;

export interface IPanel {
    loadStatus: KnockoutObservable<LoadingStatus>;

    activate(): Promise<void>;

    deactivate() : void;
}

export abstract class Panel {
    public loadStatus = ko.observable<LoadingStatus>(LoadingStatus.Loading);

    protected constructor(protected appContext: AppContext) {}

    public activate(): ActivationPromise {
        const promise = this.onActivate() || Promise.resolve();
        this.registerForLoadStatus(promise);
        return promise;
    }

    public abstract deactivate(): void;

    protected abstract onActivate(): ActivationPromise | null;
    protected registerForLoadStatus(activationPromise: ActivationPromise): void {
        activationPromise.then(() => this.loadStatus(LoadingStatus.Done));
        activationPromise.catch(() => this.loadStatus(LoadingStatus.Error));
    }
}


export type PanelFactory<T> = (params?: any, componentInfo?: KnockoutComponentTypes.ComponentInfo) => T;

export class PanelComponent<T extends Panel> implements KnockoutComponentTypes.Config {
    public viewModel: KnockoutComponentTypes.ViewModelFactoryFunction = null;
    public template: any = null;

    constructor(protected name: string, protected factory: PanelFactory<T>) {
        this.viewModel = {
            createViewModel(params?: any, componentInfo?: KnockoutComponentTypes.ComponentInfo) {
                return factory(params, componentInfo);
            }
        };

        this.template = {
            location: `ko-templates/widgets/${this.name}.html`
        };
    }
}

export function createPanelComponent<T extends Panel>(name: string, factory: PanelFactory<T>) {
    const component = new PanelComponent<T>(name, factory);

    ko.components.register(name, component);
}