import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Post,
  Get,
  UseInterceptors,
  Put,
  Delete,
  Param,
  Query,
} from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { ProductService } from './products.service';
import { CreateProductDTO, UpdateProductDTO } from './dtos';
import { GetProductQuery } from './dtos/query-product';
import { CreateProductResponse } from './dtos/reponse-product.dto';
import { UsePaginate } from '@common/decorators/use-paginate.decorator';
import { GetProductOptions } from './dtos/get-products-option';
import { Paginate, PaginateQuery } from 'nestjs-paginate';

@ApiTags('Products')
@Controller('/products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get('/public')
  @ApiOkResponse({ type: [CreateProductResponse] })
  @UseInterceptors(ClassSerializerInterceptor)
  async getPublicProducts(@Query() query: GetProductQuery) {
    return await this.productService.getAllProducts(query);
  }

  @Get('/')
  @UsePaginate(GetProductOptions)
  @ApiOkResponse({ type: [CreateProductResponse] })
  @UseInterceptors(ClassSerializerInterceptor)
  async getAllProducts(@Paginate() query: PaginateQuery) {
    return await this.productService.getProducts(query);
  }

  @Get(':id')
  @ApiOkResponse({ type: CreateProductResponse })
  @UseInterceptors(ClassSerializerInterceptor)
  async getProductById(@Param('id') id: string) {
    return await this.productService.getProductById(id);
  }

  @Post('/')
  @ApiCreatedResponse({ type: CreateProductResponse })
  @UseInterceptors(ClassSerializerInterceptor)
  async createProduct(@Body() createProduct: CreateProductDTO) {
    return await this.productService.createProduct(createProduct);
  }

  @Delete(':id')
  @UseInterceptors(ClassSerializerInterceptor)
  async deleteProductById(@Param('id') id: string) {
    return await this.productService.deleteProductById(id);
  }

  @Put(':id')
  @ApiOkResponse({ type: CreateProductResponse })
  @UseInterceptors(ClassSerializerInterceptor)
  async updateProductById(
    @Param('id') id: number,
    @Body()
    updateProductDTO: UpdateProductDTO,
  ) {
    return await this.productService.updateProductById(id, updateProductDTO);
  }
}
