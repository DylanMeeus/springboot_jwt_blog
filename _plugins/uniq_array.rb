module Jekyll
    module UniqArray
        def uniq_array(a)
           a.uniq
        end
    end
end

Liquid::Template.register_filter(Jekyll::UniqArray)
