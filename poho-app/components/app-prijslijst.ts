import {html, css, LitElement, CSSResult, render, TemplateResult} from 'lit'
import {customElement, property} from 'lit/decorators.js'

const Pages = {
    kassa: html`Kassatest`,
    prijslijst: html`prijslijstpagina.`
}

@customElement('app-prijslijst')
export class appPrijslijst extends LitElement
{
    static styles : CSSResult = css`
    :host {
        font-size: 2em;
        color: blue
    }

    `
    @property() page: string = 'kassa'
    render(): TemplateResult<1> 
    {
        return html`
        ${Pages[this.page]}
    `
    }
    
}
