using AutoMapper;
using Core.Entities;
using API.Dtos;
using Microsoft.Extensions.Configuration;
using System;

namespace API.Helpers
{
    public class ProductUrlResolver : IValueResolver<Product, ProductReturnToDto, string>
    {
        private readonly IConfiguration _config;
        public ProductUrlResolver(IConfiguration config)
        {
            _config = config;
        }

        public string Resolve(Product source, ProductReturnToDto destination, string destMember, ResolutionContext context)
        {
            if(!String.IsNullOrEmpty(source.PictureUrl))
            {
                return _config["AppUrl"] + source.PictureUrl;
            }

            return null;
        }
    }
}