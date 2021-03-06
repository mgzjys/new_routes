describe('Util', function () {


    describe('replace variable', function () {
        it('replace variables with value', function () {
            var str = '{foo} is not {foo2}.';
            var r = maptalks.StringUtil.replaceVariable(str, { foo : 'apple', foo2 : 'pear' });
            expect(r).to.eql('apple is not pear.');
        });

        it('replace variables without value', function () {
            var str = '{foo} is not {foo2}.';
            var r = maptalks.StringUtil.replaceVariable(str, { foo : 'apple' });
            expect(r).to.eql('apple is not .');
        });

        it('input null', function () {
            var str = '{foo} is not {foo2}.';
            var r = maptalks.StringUtil.replaceVariable(str, null);
            expect(r).to.eql(' is not .');
        });
    });

    it('sign', function () {
        expect(maptalks.Util.sign(-2)).to.be.eql(-1);
        expect(maptalks.Util.sign(2)).to.be.eql(1);
    });

    it('now', function () {
        var now = Date.now();
        var now2 = maptalks.Util.now();

        expect(now2 >= now).to.be.ok();
    });

    it('getSymbolStamp', function () {
        var symbol = {
            'markerType' : 'ellipse',
            'markerFill' : {
                type : 'radial',
                colorStops : [
                    [0.40, 'rgba(17, 172, 263, 1)'],
                    [0.00, 'rgba(17, 172, 263, 0)'],
                ]
            },
            'markerWidth' : 10,
            'markerHeight' : 10
        };
        var expected = 'markerType=ellipse;markerFill=radial_0,rgba(17, 172, 263, 0),0.4,rgba(17, 172, 263, 1);markerWidth=10;markerHeight=10';
        expect(maptalks.Util.getSymbolStamp(symbol)).to.be.eql(expected);

        symbol = [
            {
                'markerFile' : 'foo.png',
                'markerWidth' : 5,
                'markerHeight': 5
            },
            {
                'markerType' : 'ellipse',
                'markerFill' : {
                    type : 'radial',
                    colorStops : [
                        [0.40, 'rgba(17, 172, 263, 1)'],
                        [0.00, 'rgba(17, 172, 263, 0)'],
                    ]
                },
                'markerWidth' : 10,
                'markerHeight' : 10
            }
        ];
        expected = '[ markerFile=foo.png;markerWidth=5;markerHeight=5 , markerType=ellipse;markerFill=radial_0,rgba(17, 172, 263, 0),0.4,rgba(17, 172, 263, 1);markerWidth=10;markerHeight=10 ]';
        expect(maptalks.Util.getSymbolStamp(symbol)).to.be.eql(expected);
    });

    describe('split content', function () {
        var style = {
            'textFaceName': 'sans-serif',
            'textSize': 18,
            'textFill': '#333333',
            'textWrapWidth': 100,
            'textLineSpacing' : 8
        };
        var font = maptalks.StringUtil.getFont(style), wrapWidth = style['textWrapWidth'];

        function concat(texts) {
            return texts.map(function (t) {
                return t.text;
            }).join('');
        }

        it('split short text', function () {
            var shortText = 'short text.';
            var shorts = maptalks.StringUtil.splitContent(shortText, font, wrapWidth);
            for (var i = 0, l = shorts.length; i < l; i++) {
                var w = maptalks.StringUtil.stringWidth(shorts[i].text, font);
                expect(w).to.be.below(wrapWidth);
            }
            expect(concat(shorts)).to.be.eql(shortText);
        });


        it('split long text', function () {
            var longText = 'This is a long text : 213232132323213213123213213123213213213123123123123123123123123123123123123123.';
            var longs = maptalks.StringUtil.splitContent(longText, font, wrapWidth);
            for (var i = 0, l = longs.length; i < l; i++) {
                var w = maptalks.StringUtil.stringWidth(longs[i].text, font);
                expect(w).not.to.be.above(wrapWidth);
            }
            expect(concat(longs)).to.be.eql(longText);
        });


        it('split chinese text', function () {
            var chineseText = '???????????????????????????????????????????????????;???????????????????????????????????????????????????;??????????????????????????????????????????????????????';
            var texts = maptalks.StringUtil.splitContent(chineseText, font, wrapWidth);
            for (var i = 0, l = texts.length; i < l; i++) {
                var w = maptalks.StringUtil.stringWidth(texts[i].text, font);
                expect(w).not.to.be.above(wrapWidth);
            }
            expect(concat(texts)).to.be.eql(chineseText);
        });

        it('split chi-eng text', function () {
            var text = '????????????w???????????????   ??????1wreqdf we??????dfsdf?????????  ???;????????????  dfs??????qweqwdsd???sdfg??????fg  ?????????gdf???fsdfsd????????????;??????   ?????????sdgsd????????????dfsdf  ???????????? sdfsdf???????????????';
            var texts = maptalks.StringUtil.splitContent(text, font, wrapWidth);
            for (var i = 0, l = texts.length; i < l; i++) {
                var w = maptalks.StringUtil.stringWidth(texts[i].text, font);
                expect(w).not.to.be.above(wrapWidth);
            }
            expect(concat(texts)).to.be.eql(text);
        });

        it('split text with a small wrapWidth', function () {
            var shorts = maptalks.StringUtil.splitContent('foo', font, 2);
            for (var i = 0; i < shorts.length; i++) {
                var w = maptalks.StringUtil.stringWidth(shorts[i].text, font);
                expect(w).to.be.below(wrapWidth);
            }
            expect(shorts.length).to.be(1);
            expect(concat(shorts)).to.be.eql('');
        });
    });
});
