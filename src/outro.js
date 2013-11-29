
// Expose Z to the global object or as AMD module
if (typeof define === 'function' && define.amd) {
    define('Z', [], function() { return Z } )
} else {
    window.Z = Z
}

}(this);
