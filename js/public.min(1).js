class ID3BlogCarousel extends ID3Directive{constructor(){super("id3-blog-carousel"),this._currentIndex=0}init($elm,$params){this.params=$params,this.$element=$elm,this.bullets=this.$element.querySelectorAll(".id3-bullet-item"),console.log("BlogCarousel applied to",$elm,$params),this.resizeObserver=new ResizeObserver($entries=>{this.updateSize()}),this.resizeObserver.observe($elm),this._nextTimeoutHandle=null,this.startNextTimeout(),this.$element.addEventListener("mouseover",()=>{this.stopNextTimeout()},false),this.$element.addEventListener("mouseout",()=>{this.startNextTimeout()},false)}stopNextTimeout(){if(null!=this._nextTimeoutHandle)window.clearTimeout(this._nextTimeoutHandle)}startNextTimeout(){if(null!=this._nextTimeoutHandle)window.clearTimeout(this._nextTimeoutHandle);this._nextTimeoutHandle=window.setTimeout(()=>{this.next()},1e3*this.params.autoNextTimeout)}next(){this._currentIndex=(this._currentIndex+1)%this.bullets.length,this.update(),this.startNextTimeout()}previous(){if(this._currentIndex=this._currentIndex-1,this._currentIndex<0)this._currentIndex=this.bullets.length+this._currentIndex;this.update(),this.startNextTimeout()}select($index){this._currentIndex=$index,this.update(),this.startNextTimeout()}update(){this.$element.style.setProperty("--id3-current-slide",this._currentIndex),this.bullets.forEach((e,i)=>{if(i==this._currentIndex)e.classList.add("id3-current");if(i!=this._currentIndex)e.classList.remove("id3-current")})}updateSize(){const elementRect=this.$element.getBoundingClientRect();this.$element.style.setProperty("--id3-element-rect-width",elementRect.width)}}class ID3Blog extends ID3AppModule{init(){this.addDirective(new ID3BlogCarousel)}}new ID3Blog;