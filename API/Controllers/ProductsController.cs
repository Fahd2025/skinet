using System.Collections.Generic;
using System.Threading.Tasks;
using API.Dtos;
using API.Errors;
using API.Helpers;
using AutoMapper;
using Core.Entities;
using Core.Interfaces;
using Core.Specifications;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class ProductsController : BaseApiController
    {
        private readonly IGenericRepository<Product> _repoProduct;
        private readonly IGenericRepository<ProductBrand> _repoProductBrand;
        private readonly IGenericRepository<ProductType> _repoProductType;
        private readonly IMapper _mapper;
        public ProductsController(IGenericRepository<Product> repoProduct,
        IGenericRepository<ProductBrand> repoProductBrand,
        IGenericRepository<ProductType> repoProductType, IMapper mapper)
        {
            _mapper = mapper;
            _repoProduct = repoProduct;
            _repoProductBrand = repoProductBrand;
            _repoProductType = repoProductType;
        }

        [Cached(600)]
        [HttpGet]
        public async Task<ActionResult<Pagination<ProductReturnToDto>>> GetProducts([FromQuery]ProductSpecParams productParams)
        {
            var countSpec = new ProductWithFilterForCountSpecification(productParams);
            var totalItemCount = await _repoProduct.CountAsync(countSpec);

            var spec = new ProductsWithTypesAndBrandsSpecification(productParams);
            var products = await _repoProduct.ListAsync(spec);
            var data = _mapper.Map<IReadOnlyList<ProductReturnToDto>>(products);

            return Ok(new Pagination<ProductReturnToDto>(productParams.PageIndex, productParams.PageSize, totalItemCount, data));
        }

        [Cached(600)]
        [HttpGet("{id}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ApiResponse), StatusCodes.Status404NotFound)]
        public async Task<ActionResult<ProductReturnToDto>> GetProduct(int id)
        {
            var spec = new ProductsWithTypesAndBrandsSpecification(id);
            var product = await _repoProduct.GetEntityWithSpec(spec);
            if (product == null) return NotFound(new ApiResponse(404));
            return Ok(_mapper.Map<ProductReturnToDto>(product));
        }

        [Cached(600)]
        [HttpGet("brands")]
        public async Task<ActionResult<IReadOnlyList<ProductBrand>>> GetProductBrands()
        {
            var brands = await _repoProductBrand.ListAllAsync();
            return Ok(brands);
        }

        [Cached(600)]
        [HttpGet("types")]
        public async Task<ActionResult<IReadOnlyList<ProductType>>> GetProductTypes()
        {
            var types = await _repoProductType.ListAllAsync();
            return Ok(types);
        }
    }
}