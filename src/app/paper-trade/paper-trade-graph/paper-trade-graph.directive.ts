import { Directive, ElementRef } from '@angular/core';
import * as D3 from 'd3';
import { BinanceService } from '../../binance-api/binance.service';
import { IndicatorsService } from '../../indicators/indicators.service';

@Directive({
    selector: 'paper-trade-graph',
    exportAs: 'paperTradeGraph'
})

export class PaperTradeGraphDirective {

    private htmlElement: HTMLElement;
    private binanceService: BinanceService;
    private indicatorsService: IndicatorsService;

    constructor(elementRef: ElementRef, binanceService: BinanceService, indicatorsService: IndicatorsService) {
        this.htmlElement = elementRef.nativeElement;  // reference to <bar-graph> element from the main template
        this.binanceService = binanceService;
        this.indicatorsService = indicatorsService;
    }

    displayPaperTradeGraph(data, buyDates, sellDates) {
        let d3: any = D3;
        d3.select("svg").remove();
        // set the dimensions and margins of the graph
        var margin = {
            top: 20,
            right: 80,
            bottom: 30,
            left: 50
        },
            width = 1800 - margin.left - margin.right,
            height = 800 - margin.top - margin.bottom;

        // set the ranges
        var x = d3.scaleTime().range([0, width]);
        var y = d3.scaleLinear().range([height, 0]);

        // define the line
        var line = d3.line()
            .x(function (d) {
                return x(new Date(d.closeTime));
            })
            .y(function (d) {
                return y(d.closePrice);
            });

        var svg = d3.select(this.htmlElement).append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        x.domain(d3.extent(data, function (d) {
            return d.closeTime;
        }));

        y.domain([0, d3.max(data, function (d) {
            return +d.closePrice;
        })]);

        // Add the line path.
        svg.append("path")
            .attr("class", "line")
            .style("fill", "none")
            .attr("d", line(data))
            .style("stroke", "SteelBlue");

        // Add the scatterplot
        svg.selectAll("dot")
            .data(data)
            .enter().append("circle")
            .attr("r", function (d) { if (buyDates.includes(d.openTime) || sellDates.includes(d.openTime)) { return 3; } })
            .attr("cx", function (d) { if (buyDates.includes(d.openTime) || sellDates.includes(d.openTime)) { return x(d.closeTime); } })
            .attr("cy", function (d) { if (buyDates.includes(d.openTime) || sellDates.includes(d.openTime)) { return y(d.closePrice); } })
            .style("fill", function (d) { if (buyDates.includes(d.openTime)) { return "green"; } else { return "red"; } });

        // Add the X Axis
        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x));

        // Add the Y Axis
        svg.append("g")
            .call(d3.axisLeft(y))
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .text("Price ($)");
    }
}