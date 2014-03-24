define({
    create: function () {
        return {
            pages: function (page, page_count, frame) {
                var result = [],
                left,
                right;

                result.push({
                    index: 1,
                    active: page == 1
                });

                left = Math.max(page - frame, 2);
                right = Math.min(page + frame, page_count);

                if (right >= left) {
                    if (left > 2) {
                        result.push({
                            splitter: true
                        })
                    }

                    for (var index = left; index <= right; index++) {
                        result.push({
                            index: index,
                            active: page == index
                        });
                    }

                    if (right < page_count - 1) {
                        result.push({
                            splitter: true
                        })
                    }
                }

                if (right < page_count) {
                    result.push({
                        index: page_count,
                        active: false
                    })
                }

                return result;
            }
        };
    }
})