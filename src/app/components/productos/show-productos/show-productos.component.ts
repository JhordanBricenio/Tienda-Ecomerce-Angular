import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { tap } from 'rxjs';
import { Product } from 'src/app/models/producto';
import { ProductoService } from 'src/app/sercices/producto.service';

declare var tns;
declare var lightGallery: any;

@Component({
  selector: 'app-show-productos',
  templateUrl: './show-productos.component.html',
  styleUrls: ['./show-productos.component.css'],
})
export class ShowProductosComponent implements OnInit {
  public producto: Product;
  public slug;

  constructor(
    private productoService: ProductoService,
    private activateRoute: ActivatedRoute
  ) {
    this.activateRoute.params.subscribe((params) => {
      this.slug = params['slug'];
      this.productoService.getProductsSlug(this.slug).subscribe((response) => {
        this.producto = response;
      });
    });
  }

  ngOnInit(): void {
    tns({
      container: '.cs-carousel-inner',
      controlsText: [
        '<i class="cxi-arrow-left"></i>',
        '<i class="cxi-arrow-right"></i>',
      ],
      navPosition: 'top',
      controlsPosition: 'top',
      mouseDrag: !0,
      speed: 600,
      autoplayHoverPause: !0,
      autoplayButtonOutput: !1,
      navContainer: '#cs-thumbnails',
      navAsThumbnails: true,
      gutter: 15,
    });
    var e = document.querySelectorAll('.cs-gallery');
    if (e.length) {
      for (var t = 0; t < e.length; t++) {
        lightGallery(e[t], {
          selector: '.cs-gallery-item',
          download: !1,
          videojs: !0,
          youtubePlayerParams: { modestbranding: 1, showinfo: 0, rel: 0 },
          vimeoPlayerParams: { byline: 0, portrait: 0 },
        });
      }
    }

    tns({
      container: '.cs-carousel-inner-two',
      controlsText: [
        '<i class="cxi-arrow-left"></i>',
        '<i class="cxi-arrow-right"></i>',
      ],
      navPosition: 'top',
      controlsPosition: 'top',
      mouseDrag: !0,
      speed: 600,
      autoplayHoverPause: !0,
      autoplayButtonOutput: !1,
      nav: false,
      controlsContainer: '#custom-controls-related',
      responsive: {
        0: {
          items: 1,
          gutter: 20,
        },
        480: {
          items: 2,
          gutter: 24,
        },
        700: {
          items: 3,
          gutter: 24,
        },
        1100: {
          items: 4,
          gutter: 30,
        },
      },
    });

    
  }
  getProductosPorCategoria(){

  }

}
