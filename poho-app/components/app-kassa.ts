import {html, css, LitElement, CSSResult, render} from 'lit'
import {customElement} from 'lit/decorators.js'


@customElement('app-kassa')
export class appKassa extends LitElement
{
    static styles : CSSResult = css`
    :host {
        font-size: 2em;
    }

    `

    render(): TemplateResult<1> 
    {

        return html`
        <app-kassatelling></app-kassatelling>
    `
    }
    
}
