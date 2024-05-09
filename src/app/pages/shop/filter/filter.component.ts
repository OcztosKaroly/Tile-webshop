import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FilterService } from '../../../shared/services/filter.service';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrl: './filter.component.scss'
})
export class FilterComponent implements OnInit {
  @Output() filters: EventEmitter<Map<string, any>> = new EventEmitter();
  color: any;
  size: any;
  where: any;

  constructor(private filterService: FilterService) {  }

  ngOnInit(): void {
    const filters = new Map;

    filters.set("colors", ["barna", "fehér", "fekete", "kék", "piros", "szürke", "zöld", "egyéb"]);
    filters.set("product_sizes", ["30x60", "25x40", "20x60", "20x50", "20x30", "20x25", "20x20", "10x20", "egyéb"]);
    filters.set("wheres", ["konyha", "fürdőszoba", "nappali", "előszoba", "folyosó", "kültér", "egyéb"]);

    this.filterService.updateFilters(filters);
  }

  onSelectionChange(event: any) {
    const filters = new Map;

    filters.set("colors", this.color && this.color.length ? this.color : ["barna", "fehér", "fekete", "kék", "piros", "szürke", "zöld", "egyéb"]);
    filters.set("product_sizes", this.size && this.size.length ? this.size : ["30x60", "25x40", "20x60", "20x50", "20x30", "20x25", "20x20", "10x20", "egyéb"]);
    filters.set("wheres", this.where && this.where.length ? this.where : ["konyha", "fürdőszoba", "nappali", "előszoba", "folyosó", "kültér", "egyéb"]);

    this.filterService.updateFilters(filters);
  }
}
