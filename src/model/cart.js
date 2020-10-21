module.exports = function Cart(oldCart) {

    this.items = oldCart.items || {};
    this.totalQty = oldCart.totalQty || 0;
    this.totalPrice = parseFloat(oldCart.totalPrice) || 0;

    this.add = function (item,id) {
 
        var storedItem = this.items[id];

        if (!storedItem) {
            storedItem = this.items[id] = {item: item};
        }
        
        this.totalQty++;
        this.totalPrice +=  parseFloat(storedItem.item.price);

    }

    this.deleteProduct = (id) => {

        this.totalPrice -= this.items[id].item.price;
        this.totalQty--;
        delete this.items[id];

    }

    this.generateArray = function() { 

            var arr = [];

            for (var id in this.items) {
                arr.push(this.items[id]);
            }

            return arr;

    }

}