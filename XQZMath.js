function matrix13(a11, a12, a13){
    this.m11 = a11;
    this.m12 = a12;
    this.m13 = a13;
}

function matrix33(a11, a12, a13, a21, a22, a23, a31, a32, a33){
    this.m11 = a11;
    this.m12 = a12;
    this.m13 = a13;
    this.m21 = a21;
    this.m22 = a22;
    this.m23 = a23;
    this.m31 = a31;
    this.m32 = a32;
    this.m33 = a33;
}

function m13timesm33(m13, m33){
    var r11 = m13.m11 * m33.m11 + m13.m12 * m33.m21 + m13.m13 * m33.m31;
    var r12 = m13.m11 * m33.m12 + m13.m12 * m33.m22 + m13.m13 * m33.m32;
    var r13 = m13.m11 * m33.m13 + m13.m12 * m33.m23 + m13.m13 * m33.m33;
    return new matrix13(r11, r12, r13);
}

function m33timesm33(a33, b33){
    var r11 = a33.m11 * b33.m11 + a33.m12 * b33.m21 + a33.m13 * b33.m31;
    var r12 = a33.m11 * b33.m12 + a33.m12 * b33.m22 + a33.m13 * b33.m32;
    var r13 = a33.m11 * b33.m13 + a33.m12 * b33.m23 + a33.m13 * b33.m33;

    var r21 = a33.m21 * b33.m11 + a33.m22 * b33.m21 + a33.m33 * b33.m31;
    var r22 = a33.m21 * b33.m12 + a33.m22 * b33.m22 + a33.m33 * b33.m32;
    var r23 = a33.m21 * b33.m13 + a33.m22 * b33.m23 + a33.m33 * b33.m33;

    var r31 = a33.m31 * b33.m11 + a33.m32 * b33.m21 + a33.m33 * b33.m31;
    var r32 = a33.m31 * b33.m12 + a33.m32 * b33.m22 + a33.m33 * b33.m32;
    var r33 = a33.m31 * b33.m13 + a33.m32 * b33.m23 + a33.m33 * b33.m33;
    return new matrix33(r11, r12, r13, r21, r22, r23, r31, r32, r33);
}